import type { ClientSchema } from '@tql/server/shared';
import type {
  MutationInputFor,
  MutationNameFor,
  MutationOptions,
  MutationPayloadFor,
  SingleMutationChangesForName,
} from '../mutation/mutation.types';
import { Query, singleQueryInput } from '../query/query';
import { QueryInputFor, QueryNameFor, QueryOptions, QueryResponse, SingleQueryRequestFor, QueryUpdateHooksMap } from '../query/query.types';
import { createQueryStore, QueryStore } from '../query/query-store';
import { Mutation, singleMutationInput } from '../mutation/mutation';
import { createMutationStore, MutationStore } from '../mutation/mutation.store';
import { ActiveSubscriptionEntry, createSubscriptionStore, Subscription, SubscriptionRuntime, SubscriptionStore } from '../subscription';
import type { SubscriptionNameFor, SubscriptionOptions } from '../subscription';
import {
  HttpTransport,
  HttpTransportOptions,
  SseTransport,
  SseTransportOptions,
  SubscriptionTransport,
  WsTransport,
  WsTransportOptions,
} from '../transports';

export type ClientHandleQuery<S extends ClientSchema> = <const Q extends Record<string, any>>(
  query: Q & Partial<S['QueryInputMap']>,
) => Promise<any>;

export type ClientHandleMutation<S extends ClientSchema> = <const M extends Record<string, any>>(
  mutation: M & Partial<S['MutationInputMap']>,
) => Promise<any>;

export type ClientTransportsConfig = {
  http: HttpTransport | HttpTransportOptions;
  ws?: WsTransport | WsTransportOptions;
  sse?: SseTransport | SseTransportOptions;
};

export type ClientOptions = {
  /** Unified transport config (preferred). */
  transports: ClientTransportsConfig;
  /**
   * Which transport should carry subscriptions. Required when both
   * `ws` and `sse` are configured; inferred to whichever exists
   * otherwise.
   */
  subscriptionTransport?: 'ws' | 'sse';
};

export class Client<S extends ClientSchema> {
  private readonly queryStore: QueryStore;

  private readonly queryUpdateHooks: QueryUpdateHooksMap = {};

  private readonly mutationStore: MutationStore;

  private readonly subscriptionStore: SubscriptionStore;

  private readonly httpTransport: HttpTransport | null;

  private readonly wsTransport: WsTransport | null;

  private readonly sseTransport: SseTransport | null;

  private readonly subscriptionTransport: SubscriptionTransport | null;

  private readonly activeSubscriptions: Set<ActiveSubscriptionEntry> = new Set();

  private readonly subscriptionRuntime: SubscriptionRuntime;

  /**
   * In-flight connect attempts per transport. We dedupe so multiple
   * concurrent `Subscription.subscribe()` calls share one `connect()`.
   */
  private readonly connectPromises: WeakMap<SubscriptionTransport, Promise<void>> = new WeakMap();

  constructor(options: ClientOptions) {
    this.queryStore = createQueryStore();
    this.mutationStore = createMutationStore();
    this.subscriptionStore = createSubscriptionStore();

    if ('transports' in options && options.transports) {
      this.httpTransport = resolveHttp(options.transports.http);

      this.wsTransport = options.transports.ws ? resolveWs(options.transports.ws) : null;

      this.sseTransport = options.transports.sse ? resolveSse(options.transports.sse) : null;

      this.subscriptionTransport = pickSubscriptionTransport({
        wsTransport: this.wsTransport,
        sseTransport: this.sseTransport,
        preferred: options.subscriptionTransport,
      });
    } else {
      this.httpTransport = null;
      this.wsTransport = null;
      this.sseTransport = null;
      this.subscriptionTransport = null;
    }

    this.subscriptionRuntime = {
      queryStore: this.queryStore,
      queryUpdateHooks: this.queryUpdateHooks,
      subscriptionStore: this.subscriptionStore,
      getTransport: () => {
        if (!this.subscriptionTransport) {
          throw new Error('Client was constructed without a subscription transport. Configure `transports.sse` or `transports.ws`.');
        }
        return this.subscriptionTransport;
      },
      ensureConnected: () => this.ensureSubscriptionTransportConnected(),
      registerActive: (entry) => {
        this.activeSubscriptions.add(entry);
      },
      unregisterActive: (entry) => {
        const removed = this.activeSubscriptions.delete(entry);
        if (removed && this.activeSubscriptions.size === 0) {
          void this.releaseSubscriptionTransportIfIdle();
        }
      },
    };
  }

  /**
   * Open `transport` if it isn't already; deduplicates concurrent
   * callers so only a single `connect()` is in flight per transport.
   */
  private async ensureTransportConnected(transport: SubscriptionTransport): Promise<void> {
    if (transport.isConnected()) return;

    const inflight = this.connectPromises.get(transport);
    if (inflight) return inflight;

    const promise = (async () => {
      try {
        await transport.connect();
      } finally {
        this.connectPromises.delete(transport);
      }
    })();

    this.connectPromises.set(transport, promise);
    return promise;
  }

  /**
   * Lazily open the subscription transport (SSE stream or WebSocket).
   * Called by `Subscription.subscribe()` — users don't invoke this
   * directly. When a WS transport is configured for `transport: 'ws'`
   * queries/mutations it is opened alongside the subscription
   * transport.
   */
  private async ensureSubscriptionTransportConnected(): Promise<void> {
    if (!this.subscriptionTransport) {
      throw new Error('Client was constructed without a subscription transport. Configure `transports.sse` or `transports.ws`.');
    }

    await this.ensureTransportConnected(this.subscriptionTransport);

    if (this.wsTransport && this.wsTransport !== this.subscriptionTransport) {
      await this.ensureTransportConnected(this.wsTransport);
    }
  }

  /**
   * Lazily open the WS transport for a `transport: 'ws'` query or
   * mutation. Safe to call even when the subscription transport is a
   * separate SSE connection — the WS transport is opened on demand
   * and reused across subsequent calls.
   */
  private async ensureWsTransportConnected(): Promise<void> {
    if (!this.wsTransport) {
      throw new Error("`transport: 'ws'` requires `transports.ws` on the client.");
    }
    await this.ensureTransportConnected(this.wsTransport);
  }

  /**
   * Invoked whenever the last active subscription is unregistered.
   * Closes the subscription transport (and any auxiliary WS transport
   * that was brought up by `ensureSubscriptionTransportConnected`).
   * Teardown is best-effort.
   */
  private async releaseSubscriptionTransportIfIdle(): Promise<void> {
    if (this.activeSubscriptions.size > 0) return;

    const transports: SubscriptionTransport[] = [];
    if (this.subscriptionTransport && this.subscriptionTransport.isConnected()) {
      transports.push(this.subscriptionTransport);
    }
    if (this.wsTransport && this.wsTransport !== this.subscriptionTransport && this.wsTransport.isConnected()) {
      transports.push(this.wsTransport);
    }

    for (const transport of transports) {
      try {
        await transport.disconnect();
      } catch {
        // Teardown is best-effort.
      }
    }
  }

  createQuery<QueryName extends QueryNameFor<S>, QueryInput extends QueryInputFor<S, QueryName>, QueryParams extends Record<string, any>>(
    queryName: QueryName,
    options: QueryOptions<S, QueryName, QueryInput, QueryParams>,
  ) {
    const transport = options.transport ?? 'http';

    const handler = this.buildQueryHandler(transport);

    return new Query<S, QueryName, QueryInput, QueryParams>({
      store: this.queryStore,
      queryName,
      queryOptions: options,
      queryUpdateHooks: this.queryUpdateHooks,
      queryHandler: handler,
    });
  }

  createMutation<const MutationName extends MutationNameFor<S>, MutationParams extends Record<string, any>>(
    mutationName: MutationName,
    options: MutationOptions<S, MutationName, MutationPayloadFor<S, MutationName>, MutationParams>,
  ) {
    const transport = options.transport ?? 'http';

    const handler = this.buildMutationHandler(transport);

    return new Mutation<S, MutationName, MutationPayloadFor<S, MutationName>, MutationParams>({
      queryStore: this.queryStore,
      queryUpdateHooks: this.queryUpdateHooks,
      mutationHandler: handler,
      mutationStore: this.mutationStore,
      mutationName,
      mutationOptions: options,
    });
  }

  createSubscription<const Name extends SubscriptionNameFor<S>, Params extends Record<string, any>>(
    subscriptionName: Name,
    options: SubscriptionOptions<S, Name, Params>,
  ) {
    return new Subscription<S, Name, Params>({
      runtime: this.subscriptionRuntime,
      subscriptionName,
      subscriptionOptions: options,
    });
  }

  public query<const QueryName extends QueryNameFor<S>, const Input extends QueryInputFor<S, QueryName>>(
    queryName: QueryName,
    input: Input,
  ) {
    const query = singleQueryInput(queryName, input) as SingleQueryRequestFor<S, QueryName, Input>;

    const handler = this.buildQueryHandler('http');

    return handler<typeof query>(query as typeof query & Partial<S['QueryInputMap']>) as Promise<QueryResponse<S, typeof query>>;
  }

  public mutation<const MutationName extends MutationNameFor<S>>(mutationName: MutationName, input: MutationPayloadFor<S, MutationName>) {
    const mutation = singleMutationInput(mutationName, {
      input,
    } as unknown as MutationInputFor<S, MutationName>);

    const handler = this.buildMutationHandler('http');

    return handler(mutation as any).then((response) => {
      const result = response?.[mutationName];

      if (!result) {
        throw new Error('Invalid response from mutation');
      }

      if (result.error) {
        throw result.error;
      }

      return result.changes;
    }) as Promise<SingleMutationChangesForName<S, MutationName>>;
  }

  reset() {
    this.queryStore.getState().reset();
    this.mutationStore.getState().reset();
    this.subscriptionStore.getState().reset();
  }

  private buildQueryHandler(transport: 'http' | 'ws'): ClientHandleQuery<S> {
    console.log({ transport });

    if (transport === 'ws') {
      if (!this.wsTransport) {
        throw new Error("createQuery/`transport: 'ws'` requires `transports.ws` on the client.");
      }

      const wsTransport = this.wsTransport;

      return (async (payload: any) => {
        await this.ensureWsTransportConnected();
        return wsTransport.query(payload);
      }) as ClientHandleQuery<S>;
    }

    if (this.httpTransport) {
      const httpTransport = this.httpTransport;

      return ((payload: any) => httpTransport.query(payload)) as ClientHandleQuery<S>;
    }

    throw new Error('Client has no HTTP transport configured. Set `transports.http` on the client.');
  }

  private buildMutationHandler(transport: 'http' | 'ws'): ClientHandleMutation<S> {
    if (transport === 'ws') {
      if (!this.wsTransport) {
        throw new Error("createMutation/`transport: 'ws'` requires `transports.ws` on the client.");
      }

      const wsTransport = this.wsTransport;

      return (async (payload: any) => {
        await this.ensureWsTransportConnected();
        return wsTransport.mutation(payload);
      }) as ClientHandleMutation<S>;
    }

    if (this.httpTransport) {
      const httpTransport = this.httpTransport;

      return ((payload: any) => httpTransport.mutation(payload)) as ClientHandleMutation<S>;
    }

    throw new Error('Client has no HTTP transport configured. Set `transports.http` on the client.');
  }
}

const resolveHttp = (input: HttpTransport | HttpTransportOptions): HttpTransport => {
  return input instanceof HttpTransport ? input : new HttpTransport(input);
};

const resolveWs = (input: WsTransport | WsTransportOptions): WsTransport => {
  return input instanceof WsTransport ? input : new WsTransport(input);
};

const resolveSse = (input: SseTransport | SseTransportOptions): SseTransport => {
  return input instanceof SseTransport ? input : new SseTransport(input);
};

const pickSubscriptionTransport = (options: {
  wsTransport: WsTransport | null;
  sseTransport: SseTransport | null;
  preferred: 'ws' | 'sse' | undefined;
}): SubscriptionTransport | null => {
  const { wsTransport, sseTransport, preferred } = options;

  if (wsTransport && sseTransport) {
    if (!preferred) {
      throw new Error(
        'Both `transports.ws` and `transports.sse` were configured. Set `subscriptionTransport: "ws" | "sse"` to pick which one carries subscriptions.',
      );
    }
    return preferred === 'ws' ? wsTransport : sseTransport;
  }

  if (preferred === 'ws' && !wsTransport) {
    throw new Error('`subscriptionTransport: "ws"` was requested but `transports.ws` is not configured.');
  }

  if (preferred === 'sse' && !sseTransport) {
    throw new Error('`subscriptionTransport: "sse"` was requested but `transports.sse` is not configured.');
  }

  return wsTransport ?? sseTransport ?? null;
};
