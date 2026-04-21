import { produce } from 'immer';
import type { ClientSchema } from '@tql/server/shared';
import { createOptimisticUpdate } from '../query/query-optimistic-update';
import { QueryStore } from '../query/query-store';
import { QueryUpdateHooksMap } from '../query/query.types';
import { applyChangesToQueryStore, ChangesByEntity } from '../shared/apply-changes-to-query-store';
import {
  SubscribeHandle,
  SubscriberBatchMatch,
  SubscriberBatchMessage,
  SubscriberBatchRow,
  SubscriberBatchRows,
  SubscriptionTransport,
  toFormattedError,
} from '../transports/subscription-transport';
import type { OptimisticQueryStorePublic } from '../mutation/mutation.types';
import { createSubscriptionHashKey, createSubscriptionStore, SubscriptionState, SubscriptionStore } from './subscription.store';
import type { SubscriptionArgsFor, SubscriptionNameFor, SubscriptionOnChangeMap, SubscriptionOptions } from './subscription.types';

/**
 * Shared runtime used by every subscription the client creates. The
 * `Client` constructs one `SubscriptionRuntime` and threads it into
 * each `Subscription` instance; the runtime is responsible for:
 *   - exposing the active `SubscriptionTransport` (SSE or WS)
 *   - driving the transport lifecycle: `ensureConnected()` opens the
 *     stream/socket on first subscribe; `registerActive` /
 *     `unregisterActive` let the client refcount live subscriptions
 *     and close the transport when none remain.
 *   - fan-out of incoming `subscription:batch` frames into per-handle
 *     listeners — individual `Subscription` objects don't talk to the
 *     transport directly.
 */
export type SubscriptionRuntime = {
  readonly queryStore: QueryStore;
  readonly queryUpdateHooks: QueryUpdateHooksMap;
  readonly subscriptionStore: SubscriptionStore;
  /** Returns the configured subscription transport, or throws if the
   * client was instantiated without SSE / WS. */
  readonly getTransport: () => SubscriptionTransport;
  /**
   * Open the subscription transport if it isn't open already. Called
   * by `Subscription.subscribe()` — users never call this directly.
   * Safe to invoke concurrently; duplicate calls share the same
   * in-flight connect.
   */
  readonly ensureConnected: () => Promise<void>;
  /** Register a live subscription handle. The client refcounts these
   *  entries and tears the transport down once the last one is
   *  released. */
  readonly registerActive: (entry: ActiveSubscriptionEntry) => void;
  /** Remove a previously-registered handle. When the last handle is
   *  unregistered the client will auto-disconnect the transport. */
  readonly unregisterActive: (entry: ActiveSubscriptionEntry) => void;
};

/**
 * Book-keeping record the client uses to refcount live subscriptions.
 * Each live `.subscribe(params)` call publishes exactly one entry.
 */
export type ActiveSubscriptionEntry = {
  hashKey: string;
  unsubscribe: () => Promise<void>;
};

type SubscriptionConstructor<S extends ClientSchema, Name extends SubscriptionNameFor<S>, Params extends Record<string, any>> = {
  runtime: SubscriptionRuntime;
  subscriptionName: Name;
  subscriptionOptions: SubscriptionOptions<S, Name, Params>;
};

type InternalHandle = {
  hashKey: string;
  params: Record<string, any>;
  args: any;
  handle: SubscribeHandle;
  active: ActiveSubscriptionEntry;
};

export class Subscription<S extends ClientSchema, Name extends SubscriptionNameFor<S>, Params extends Record<string, any>> {
  private readonly runtime: SubscriptionRuntime;

  private readonly subscriptionName: Name;

  private readonly subscriptionKey: string;

  private readonly argsFactory: (params: Params) => SubscriptionArgsFor<S, Name>;

  private readonly onChange: SubscriptionOnChangeMap<S, Name>;

  private readonly handles: Map<string, InternalHandle> = new Map();

  /**
   * In-flight `subscribe(params)` promises keyed by `hashKey`. Used to
   * dedupe concurrent subscribe calls for the same key so we never
   * issue two `transport.subscribe(...)` RPCs for the same logical
   * subscription. React StrictMode's mount → cleanup → mount cycle
   * (and any two components that mount with the same subscription +
   * params at once) would otherwise each start their own subscribe
   * during the async gap before `handles` is populated.
   */
  private readonly pendingSubscribes: Map<string, Promise<{ subscriptionId: string }>> = new Map();

  /**
   * Refcount of logical subscribers per `hashKey`. Each `subscribe()`
   * bumps it; each `unsubscribe()` decrements and only tears down the
   * transport-level handle when the count hits zero (and no new
   * subscriber has arrived during the async teardown window).
   */
  private readonly refs: Map<string, number> = new Map();

  constructor(options: SubscriptionConstructor<S, Name, Params>) {
    this.runtime = options.runtime;
    this.subscriptionName = options.subscriptionName;
    this.subscriptionKey = options.subscriptionOptions.subscriptionKey;
    this.argsFactory = options.subscriptionOptions.args;
    this.onChange = options.subscriptionOptions.onChange ?? ({} as SubscriptionOnChangeMap<S, Name>);
  }

  public getHashKey(params: Params): string {
    return createSubscriptionHashKey(this.subscriptionKey, this.argsFactory(params));
  }

  public getState(params: Params): SubscriptionState {
    const state = this.runtime.subscriptionStore.getState().state[this.getHashKey(params)];

    if (!state) {
      throw new Error(`Subscription ${this.subscriptionKey} has not been subscribed yet`);
    }

    return state;
  }

  public getStateOrNull(params: Params): SubscriptionState | null {
    return this.runtime.subscriptionStore.getState().state[this.getHashKey(params)] ?? null;
  }

  public subscribeStore = (params: Params, callback: (state: SubscriptionState) => void) => {
    const hashKey = this.getHashKey(params);

    return this.runtime.subscriptionStore.subscribe((store) => {
      const state = store.state[hashKey];
      if (state) callback(state);
    });
  };

  public async subscribe(params: Params): Promise<{ subscriptionId: string }> {
    const hashKey = this.getHashKey(params);

    this.refs.set(hashKey, (this.refs.get(hashKey) ?? 0) + 1);

    const existing = this.handles.get(hashKey);

    if (existing) {
      return { subscriptionId: existing.handle.subscriptionId };
    }

    const pending = this.pendingSubscribes.get(hashKey);

    if (pending) {
      return pending;
    }

    const promise = this.doSubscribe(params, hashKey).finally(() => {
      this.pendingSubscribes.delete(hashKey);
    });

    this.pendingSubscribes.set(hashKey, promise);

    return promise;
  }

  private async doSubscribe(params: Params, hashKey: string): Promise<{ subscriptionId: string }> {
    const args = this.argsFactory(params);

    this.runtime.subscriptionStore.getState().setState(hashKey, {
      subscriptionName: this.subscriptionName as string,
      subscriptionKey: this.subscriptionKey,
      subscriptionHashKey: hashKey,
      args,
      subscriptionId: null,
      status: 'subscribing',
      error: null,
      lastBatchAt: null,
    });

    try {
      await this.runtime.ensureConnected();

      const transport = this.runtime.getTransport();

      const handle = await transport.subscribe({
        name: this.subscriptionName as string,
        args,
        listener: {
          onBatch: (batch) => this.handleBatch(hashKey, args, batch),
          onError: (error) => {
            this.runtime.subscriptionStore.getState().patch(hashKey, {
              status: 'error',
              error: toFormattedError(error),
            });
          },
        },
      });

      const active: ActiveSubscriptionEntry = {
        hashKey,
        unsubscribe: async () => {
          await handle.unsubscribe();
        },
      };

      this.handles.set(hashKey, { hashKey, params, args, handle, active });

      this.runtime.registerActive(active);

      this.runtime.subscriptionStore.getState().patch(hashKey, {
        subscriptionId: handle.subscriptionId,
        status: 'active',
        error: null,
      });

      return { subscriptionId: handle.subscriptionId };
    } catch (error) {
      this.runtime.subscriptionStore.getState().patch(hashKey, {
        status: 'error',
        error: toFormattedError(error),
      });
      throw error;
    }
  }

  public async unsubscribe(params: Params): Promise<void> {
    const hashKey = this.getHashKey(params);

    const currentRef = this.refs.get(hashKey) ?? 0;

    if (currentRef <= 0) return;

    const nextRef = currentRef - 1;

    if (nextRef > 0) {
      this.refs.set(hashKey, nextRef);
      return;
    }

    this.refs.delete(hashKey);

    // Wait for an in-flight subscribe so we actually have a handle
    // to close. A failed subscribe leaves nothing to tear down.
    const pending = this.pendingSubscribes.get(hashKey);

    if (pending) {
      try {
        await pending;
      } catch {
        return;
      }
    }

    // A concurrent subscribe (e.g. StrictMode re-mount) may have
    // bumped the refcount back above zero while we were awaiting.
    // If so, leave the handle live for that subscriber.
    if ((this.refs.get(hashKey) ?? 0) > 0) return;

    const internal = this.handles.get(hashKey);

    if (!internal) return;

    this.handles.delete(hashKey);

    this.runtime.unregisterActive(internal.active);

    try {
      await internal.handle.unsubscribe();
    } finally {
      this.runtime.subscriptionStore.getState().patch(hashKey, {
        status: 'closed',
        subscriptionId: null,
      });
    }
  }

  /**
   * Fan a server batch into (a) the user's per-entity `onChange`
   * hooks (each receives `store` like a mutation hook) and (b) the
   * shared `applyChangesToQueryStore` path so every registered
   * `query.updateOnChange` hook sees the same changes a mutation
   * would produce.
   */
  private handleBatch(hashKey: string, args: any, batch: SubscriberBatchMessage): void {
    const changesByEntity = this.buildChangesByEntity(batch);

    if (Object.keys(changesByEntity).length === 0) {
      this.runtime.subscriptionStore.getState().patch(hashKey, { lastBatchAt: Date.now() });
      return;
    }

    this.runEntityHooks(args, changesByEntity);

    applyChangesToQueryStore({
      queryStore: this.runtime.queryStore,
      queryUpdateHooks: this.runtime.queryUpdateHooks,
      changes: changesByEntity,
    });

    this.runtime.subscriptionStore.getState().patch(hashKey, {
      lastBatchAt: Date.now(),
      status: 'active',
      error: null,
    });
  }

  /**
   * Reshape a `SubscriberBatchMessage` (rows table + match-id lists)
   * into the `{ entity: { inserts, updates, upserts, deletes } }`
   * shape the shared query-hook helper and the user's `onChange`
   * entity hooks both want to see.
   */
  private buildChangesByEntity(batch: SubscriberBatchMessage): ChangesByEntity {
    const { rows, matches } = batch;
    const changesByEntity: ChangesByEntity = {};

    for (const match of matches as SubscriberBatchMatch[]) {
      for (const entity of Object.keys(match.changes)) {
        const bucket = match.changes[entity]!;

        const rowTable: Record<
          string,
          Partial<Record<'inserts' | 'updates' | 'upserts' | 'deletes', Record<string, SubscriberBatchRow>>>
        > = rows as unknown as typeof rowTable;

        const rowsForEntity = rowTable[entity] ?? {};

        const bucketByOp = {
          inserts: bucket.inserts,
          updates: bucket.updates,
          upserts: bucket.upserts,
          deletes: bucket.deletes,
        } as const;

        for (const op of ['inserts', 'updates', 'upserts', 'deletes'] as const) {
          const ids = bucketByOp[op];

          if (!ids || ids.length === 0) continue;

          const rowsById = (rowsForEntity as SubscriberBatchRows[string])[op] ?? {};

          const entityBucket = (changesByEntity[entity] ??= {});
          const opBucket = (entityBucket[op] ??= [] as any[]);

          for (const id of ids) {
            const row = rowsById[id];
            if (!row) continue;
            opBucket.push(row);
          }
        }
      }
    }

    return changesByEntity;
  }

  private runEntityHooks(args: any, changesByEntity: ChangesByEntity): void {
    const onChange = this.onChange as Record<string, any>;

    const optimisticStore = createOptimisticUpdate(this.runtime.queryStore);

    const optimisticStorePublic: OptimisticQueryStorePublic = {
      getAll: optimisticStore.getAll,
      get: optimisticStore.get,
      where: optimisticStore.where,
    };

    let touched = false;

    for (const entity of Object.keys(changesByEntity)) {
      const hooks = onChange[entity] as
        | {
            onInsert?: (params: { store: OptimisticQueryStorePublic; change: any; args: any }) => void;
            onUpdate?: (params: { store: OptimisticQueryStorePublic; change: any; args: any }) => void;
            onUpsert?: (params: { store: OptimisticQueryStorePublic; change: any; args: any }) => void;
            onDelete?: (params: { store: OptimisticQueryStorePublic; change: any; args: any }) => void;
          }
        | undefined;

      if (!hooks) continue;

      const bundle = changesByEntity[entity]!;

      const invoke = (fn: ((p: any) => void) | undefined, rows: any[] | undefined) => {
        if (!fn || !rows) return;
        for (const row of rows) {
          fn({ store: optimisticStorePublic, change: row, args });
          touched = true;
        }
      };

      invoke(hooks.onInsert, bundle.inserts);
      invoke(hooks.onUpdate, bundle.updates);
      invoke(hooks.onUpsert, bundle.upserts);
      invoke(hooks.onDelete, bundle.deletes);
    }

    if (!touched) return;

    const commit = optimisticStore.commit();

    const existingState = this.runtime.queryStore.getState().state;

    const nextState = produce(existingState, (draftState) => {
      for (const hashKey in commit) {
        if (draftState[hashKey]) {
          draftState[hashKey].data = commit[hashKey];
        }
      }
    });

    this.runtime.queryStore.setState({ state: nextState });
  }
}

export { createSubscriptionStore };

export type { SubscriptionState, SubscriptionStore } from './subscription.store';
