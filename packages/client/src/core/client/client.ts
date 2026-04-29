import type {
  MutationInputFor,
  MutationNameFor,
  MutationOptions,
  MutationPayloadFor,
  SingleMutationChangesForName,
} from '../mutation/mutation.types';
import { Query, singleQueryInput } from '../query/query';
import {
  ClientSchema,
  QueryInputFor,
  QueryNameFor,
  QueryOptions,
  QueryResponse,
  SingleQueryRequestFor,
  QueryUpdateHooksMap,
} from '../query/query.types';
import { createQueryStore, QueryStore } from '../query/query-store';
import { Mutation, singleMutationInput } from '../mutation/mutation';
import { createMutationStore, MutationStore } from '../mutation/mutation.store';
import type { ClientTransports, Transport, TransportKey } from '../transports';

/**
 * Internal handler signatures the `Query` / `Mutation` classes still consume.
 * Public consumers configure a transport instead — these are derived from the
 * selected `Transport` at `createQuery` / `createMutation` time.
 */
export type ClientHandleQuery<S extends ClientSchema> = <const Q extends Record<string, any>>(
  query: Q & Partial<S['QueryInputMap']>,
) => Promise<any>;

export type ClientHandleMutation<S extends ClientSchema> = <const M extends Record<string, any>>(
  mutation: M & Partial<S['MutationInputMap']>,
) => Promise<any>;

export type ClientOptions = {
  /**
   * Registered transports keyed by name. `http` is required; future kinds
   * (e.g. `ws`) will appear here as optional slots.
   */
  transports: ClientTransports;

  /**
   * Transport used when a query/mutation does not specify one. Defaults to
   * `'http'`.
   */
  defaultTransport?: TransportKey;
};

export class Client<S extends ClientSchema> {
  private readonly queryStore: QueryStore;
  private readonly queryUpdateHooks: QueryUpdateHooksMap = {};

  private readonly mutationStore: MutationStore;

  private readonly transports: ClientTransports;
  private readonly defaultTransport: TransportKey;

  constructor(options: ClientOptions) {
    this.queryStore = createQueryStore();
    this.mutationStore = createMutationStore();
    this.transports = options.transports;
    this.defaultTransport = options.defaultTransport ?? 'http';
  }

  private resolveTransport(key: TransportKey | undefined): Transport {
    const resolvedKey = key ?? this.defaultTransport;
    const transport = this.transports[resolvedKey];

    if (!transport) {
      throw new Error(`Client: transport "${resolvedKey}" is not registered`);
    }

    return transport;
  }

  private queryHandlerFor(key: TransportKey | undefined): ClientHandleQuery<S> {
    const transport = this.resolveTransport(key);
    return ((payload) => transport.query(payload)) as ClientHandleQuery<S>;
  }

  private mutationHandlerFor(key: TransportKey | undefined): ClientHandleMutation<S> {
    const transport = this.resolveTransport(key);
    return ((payload) => transport.mutation(payload)) as ClientHandleMutation<S>;
  }

  createQuery<QueryName extends QueryNameFor<S>, QueryInput extends QueryInputFor<S, QueryName>, QueryParams extends Record<string, any>>(
    queryName: QueryName,
    options: QueryOptions<S, QueryName, QueryInput, QueryParams>,
  ) {
    return new Query<S, QueryName, QueryInput, QueryParams>({
      store: this.queryStore,
      queryName,
      queryOptions: options,
      queryUpdateHooks: this.queryUpdateHooks,
      queryHandler: this.queryHandlerFor(options.transport),
    });
  }

  createMutation<const MutationName extends MutationNameFor<S>, MutationParams extends Record<string, any>>(
    mutationName: MutationName,
    options: MutationOptions<S, MutationName, MutationPayloadFor<S, MutationName>, MutationParams>,
  ) {
    return new Mutation<S, MutationName, MutationPayloadFor<S, MutationName>, MutationParams>({
      queryStore: this.queryStore,
      queryUpdateHooks: this.queryUpdateHooks,
      mutationHandler: this.mutationHandlerFor(options.transport),
      mutationStore: this.mutationStore,
      mutationName,
      mutationOptions: options,
    });
  }

  public query<const QueryName extends QueryNameFor<S>, const Input extends QueryInputFor<S, QueryName>>(
    queryName: QueryName,
    input: Input,
  ) {
    const query = singleQueryInput(queryName, input) as SingleQueryRequestFor<S, QueryName, Input>;
    const handler = this.queryHandlerFor(undefined);

    return handler<typeof query>(query as typeof query & Partial<S['QueryInputMap']>) as Promise<QueryResponse<S, typeof query>>;
  }

  public mutation<const MutationName extends MutationNameFor<S>>(mutationName: MutationName, input: MutationPayloadFor<S, MutationName>) {
    const mutation = singleMutationInput(mutationName, {
      input,
    } as unknown as MutationInputFor<S, MutationName>);

    const handler = this.mutationHandlerFor(undefined);

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
  }
}
