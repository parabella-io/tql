import { randomUUID } from 'node:crypto';

import type { z } from 'zod';

import type { Schema } from '../schema.js';
import { TQLServerError, TQLServerErrorType } from '../errors.js';
import type { BackboneMessage, EmittedChanges } from '../backbone/backbone.js';

import type { Subscription } from './subscription.js';
import {
  SubscriptionRegistry,
  type RegisteredSubscriber,
  type SubscriberBatchMatch,
  type SubscriberBatchRows,
  type SubscriberChangeOperation,
  type SubscriberMessage,
} from './subscription-registry.js';

export type SubscriptionResolverOptions = {
  schema: Schema<any, any, any>;
};

export type SubscribeOptions = {
  connectionId: string;
  subscriptionName: string;
  args: unknown;
  context: unknown;
  connection: unknown;
  send: (message: SubscriberMessage) => void;
};

export type SubscribeResult = { ok: true; id: string; unsubscribe: () => void } | { ok: false; error: TQLServerError };

/**
 * Runtime counterpart to the codegen-emitted subscription registry.
 *
 * Responsibilities:
 *  - Validate subscribe payloads against each subscription's zod args,
 *    then run `allow` and register in the in-process
 *    {@link SubscriptionRegistry}.
 *  - Dispatch {@link BackboneMessage}s to matching subscribers by first
 *    short-circuiting on `subscribeTo` entity overlap, then flattening
 *    the emit into per-row changes, computing `keyFromChange` for each,
 *    bundling rows by key, looking up candidate subscribers, and
 *    finally running the optional async `filter` on each row.
 *
 * Multiple instances of this resolver can exist (e.g. test harnesses)
 * but a {@link Server} instantiates exactly one.
 */
export class SubscriptionResolver {
  private readonly subscriptions: Record<string, Subscription<any, any, any, any, any>> = {};

  private readonly registry = new SubscriptionRegistry();

  constructor(options: SubscriptionResolverOptions) {
    const schemaSubscriptions = (options.schema as any).subscriptions as Record<string, Subscription<any, any, any, any, any>> | undefined;

    if (schemaSubscriptions) {
      for (const name of Object.keys(schemaSubscriptions)) {
        this.subscriptions[name] = schemaSubscriptions[name]!;
      }
    }
  }

  public getRegistry(): SubscriptionRegistry {
    return this.registry;
  }

  public getSubscription(name: string): Subscription<any, any, any, any, any> | undefined {
    return this.subscriptions[name];
  }

  public async subscribe(options: SubscribeOptions): Promise<SubscribeResult> {
    const subscription = this.subscriptions[options.subscriptionName];

    if (!subscription) {
      return {
        ok: false,
        error: new TQLServerError(TQLServerErrorType.SubscriptionNotFoundError, {
          subscriptionName: options.subscriptionName,
        }),
      };
    }

    const argsSchema = subscription.getArgsSchema();

    const parsed = argsSchema.safeParse(options.args);

    if (parsed.error) {
      return {
        ok: false,
        error: new TQLServerError(TQLServerErrorType.SubscriptionArgsSchemaError, {
          subscriptionName: options.subscriptionName,
          args: options.args,
          message: parsed.error.message,
        }),
      };
    }

    const allow = subscription.getAllow();

    if (allow) {
      const allowed = await allow({
        context: options.context,
        connection: options.connection,
        args: parsed.data,
      });

      if (allowed !== true) {
        return {
          ok: false,
          error: new TQLServerError(TQLServerErrorType.SubscriptionNotAllowedError, {
            subscriptionName: options.subscriptionName,
          }),
        };
      }
    }

    let key: string;
    try {
      key = subscription.getKeyFromSubscribe()({
        args: parsed.data,
        context: options.context,
        connection: options.connection,
      });
    } catch (error) {
      return {
        ok: false,
        error: new TQLServerError(TQLServerErrorType.SubscriptionError, {
          subscriptionName: options.subscriptionName,
          error,
        }),
      };
    }

    const id = randomUUID();

    const subscriber: RegisteredSubscriber = {
      id,
      connectionId: options.connectionId,
      subscriptionName: options.subscriptionName,
      key,
      args: parsed.data,
      context: options.context,
      connection: options.connection,
      send: options.send,
    };

    this.registry.add(subscriber);

    return {
      ok: true,
      id,
      unsubscribe: () => {
        this.registry.removeById(id);
      },
    };
  }

  public unsubscribe(id: string): boolean {
    return this.registry.removeById(id) !== undefined;
  }

  public removeConnection(connectionId: string): void {
    this.registry.removeByConnection(connectionId);
  }

  /**
   * Fan a single emitted message out to every connection with at
   * least one matching subscriber. Rows are keyed individually via
   * `keyFromChange`, gated per-row by each subscription's optional
   * `filter`, and then coalesced into a single `subscription:batch`
   * message per connection. Each match references rows by id against
   * a shared, deduplicated per-connection row table. Failures from a
   * single subscription's hooks are isolated so one noisy hook cannot
   * starve the others.
   */
  public async dispatch(message: BackboneMessage): Promise<void> {
    const touchedEntities = Object.keys(message.changes);

    if (touchedEntities.length === 0) return;

    const drafts = new Map<string, ConnectionDraft>();

    for (const subscriptionName of Object.keys(this.subscriptions)) {
      const subscription = this.subscriptions[subscriptionName]!;

      const subscribeTo = subscription.getSubscribeTo() as Record<string, true>;

      const narrowedChanges = narrowChanges(message.changes, subscribeTo);

      if (!narrowedChanges) continue;

      const flatChanges = flattenChanges(narrowedChanges);

      if (flatChanges.length === 0) continue;

      const keyFromChange = subscription.getKeyFromChange();

      const changesByKey = new Map<string, FlatChange[]>();

      for (const change of flatChanges) {
        let key: string | null | undefined;

        try {
          key = keyFromChange({
            change: { entity: change.entity, operation: change.operation, row: change.row } as any,
          });
        } catch {
          // A noisy keyFromChange must never stop dispatch for other
          // rows or subscriptions. Drop this one row and keep going.
          continue;
        }

        if (key === null || key === undefined) continue;

        const existing = changesByKey.get(key);

        if (existing) {
          existing.push(change);
        } else {
          changesByKey.set(key, [change]);
        }
      }

      if (changesByKey.size === 0) continue;

      const filter = subscription.getFilter();

      for (const [key, keyedChanges] of changesByKey) {
        console.log('key', key);

        const candidates = this.registry.lookup(subscriptionName, key);

        console.log('candidates', candidates);

        if (candidates.length === 0) continue;

        for (const candidate of candidates) {
          let allowed: FlatChange[];

          try {
            allowed = filter ? await collectAllowedChanges(filter, candidate, keyedChanges) : keyedChanges;
          } catch {
            // A noisy filter must never poison the dispatch loop. Skip
            // this candidate's delivery for this emit.
            continue;
          }

          if (allowed.length === 0) continue;

          appendMatch(drafts, candidate, subscriptionName, allowed);
        }
      }
    }

    for (const draft of drafts.values()) {
      if (draft.matches.length === 0) continue;

      try {
        draft.send({
          type: 'subscription:batch',
          rows: draft.rows,
          matches: draft.matches,
        });
      } catch {
        // Transport/send errors cannot bubble into the backbone.
      }
    }
  }
}

/**
 * Per-connection accumulator built during dispatch. Every
 * {@link RegisteredSubscriber} on the same connection shares the same
 * transport `send` (set up when the connection was opened), so we
 * pick the first writer we encounter and reuse it for the flushed
 * batch.
 */
type ConnectionDraft = {
  send: (message: SubscriberMessage) => void;
  rows: SubscriberBatchRows;
  matches: SubscriberBatchMatch[];
};

const appendMatch = (
  drafts: Map<string, ConnectionDraft>,
  candidate: RegisteredSubscriber,
  subscriptionName: string,
  allowed: FlatChange[],
): void => {
  let draft = drafts.get(candidate.connectionId);

  if (!draft) {
    draft = { send: candidate.send, rows: {}, matches: [] };
    drafts.set(candidate.connectionId, draft);
  }

  const changes: SubscriberBatchMatch['changes'] = {};

  for (const change of allowed) {
    const bucketKey = `${change.operation}s` as SubscriberChangeOperation;

    const rowsEntity = (draft.rows[change.entity] ??= {});
    const rowsBucket = (rowsEntity[bucketKey] ??= {});
    rowsBucket[change.row.id] = change.row;

    const changesEntity = (changes[change.entity] ??= {});
    const changesBucket = (changesEntity[bucketKey] ??= []);

    if (!changesBucket.includes(change.row.id)) {
      changesBucket.push(change.row.id);
    }
  }

  draft.matches.push({ id: candidate.id, name: subscriptionName, changes });
};

/**
 * Flat (entity, operation, row) tuples extracted from a narrowed
 * change bundle. Used to drive per-row `filter` invocations without
 * paying the iteration cost N times across N candidates.
 */
type FlatChange = { entity: string; operation: 'insert' | 'update' | 'upsert' | 'delete'; row: { id: string } & Record<string, unknown> };

const flattenChanges = (narrowedChanges: Record<string, any>): FlatChange[] => {
  const flat: FlatChange[] = [];

  for (const entity of Object.keys(narrowedChanges)) {
    const bundle = narrowedChanges[entity] as Record<string, Array<FlatChange['row']>> | undefined;
    if (!bundle) continue;

    for (const op of ['inserts', 'updates', 'upserts', 'deletes'] as const) {
      const rows = bundle[op];
      if (!rows || rows.length === 0) continue;

      const operation = op.slice(0, -1) as FlatChange['operation'];

      for (const row of rows) {
        flat.push({ entity, operation, row });
      }
    }
  }

  return flat;
};

/**
 * Run the per-row `filter` over `flat` and return the subset the
 * subscriber is allowed to see, preserving the original order.
 * Returning a `FlatChange[]` lets the caller splice rows into the
 * shared per-connection row table without rebuilding bundles.
 */
const collectAllowedChanges = async (
  filter: NonNullable<ReturnType<Subscription<any, any, any, any, any>['getFilter']>>,
  candidate: { context: unknown; connection: unknown; args: unknown },
  flat: FlatChange[],
): Promise<FlatChange[]> => {
  const allowed: FlatChange[] = [];

  for (const change of flat) {
    let permitted = false;
    try {
      const result = await filter({
        context: candidate.context as any,
        connection: candidate.connection as any,
        args: candidate.args as any,
        change: { entity: change.entity, operation: change.operation, row: change.row } as any,
      });
      permitted = result === true;
    } catch {
      // Per-row filter failures fail closed for that one row only,
      // mirroring the previous all-or-nothing semantic at row scope.
      permitted = false;
    }

    if (permitted) allowed.push(change);
  }

  return allowed;
};

/**
 * Reduce the emitted `changes` payload to only the entities a given
 * subscription declared interest in. Returns `null` when there is no
 * overlap so the caller can short-circuit before calling user hooks.
 */
const narrowChanges = (changes: EmittedChanges, subscribeTo: Record<string, true>): Record<string, any> | null => {
  const narrowed: Record<string, any> = {};

  let hasAny = false;

  for (const entityName of Object.keys(subscribeTo)) {
    const entry = changes[entityName];
    if (entry === undefined) continue;
    narrowed[entityName] = entry;
    hasAny = true;
  }

  if (!hasAny) return null;
  return narrowed;
};

// Helper to avoid unused generic warning in consumers that pass zod schemas.
export type SubscribedArgsOf<S> = S extends Subscription<any, any, any, infer A, any> ? z.infer<A> : never;
