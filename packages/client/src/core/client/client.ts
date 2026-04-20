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

export type ClientHandleQuery<S extends ClientSchema> = <const Q extends Record<string, any>>(
  query: Q & Partial<S['QueryInputMap']>,
) => Promise<any>;

export type ClientHandleMutation<S extends ClientSchema> = <const M extends Record<string, any>>(
  mutation: M & Partial<S['MutationInputMap']>,
) => Promise<any>;

export type ClientOptions<S extends ClientSchema> = {
  handleQuery: ClientHandleQuery<S>;
  handleMutation: ClientHandleMutation<S>;
};

export class Client<S extends ClientSchema> {
  private readonly queryStore: QueryStore;
  private readonly queryUpdateHooks: QueryUpdateHooksMap = {};
  private readonly handleQuery: ClientHandleQuery<S>;

  private readonly mutationStore: MutationStore;
  private readonly handleMutation: ClientHandleMutation<S>;

  constructor(options: ClientOptions<S>) {
    this.queryStore = createQueryStore();
    this.handleQuery = options.handleQuery;
    this.mutationStore = createMutationStore();
    this.handleMutation = options.handleMutation;
  }

  createQuery<
    QueryName extends QueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(queryName: QueryName, options: QueryOptions<S, QueryName, QueryInput, QueryParams>) {
    return new Query<S, QueryName, QueryInput, QueryParams>({
      store: this.queryStore,
      queryName,
      queryOptions: options,
      queryUpdateHooks: this.queryUpdateHooks,
      queryHandler: this.handleQuery,
    });
  }

  createMutation<
    const MutationName extends MutationNameFor<S>,
    MutationParams extends Record<string, any>,
  >(
    mutationName: MutationName,
    options: MutationOptions<
      S,
      MutationName,
      MutationPayloadFor<S, MutationName>,
      MutationParams
    >,
  ) {
    return new Mutation<S, MutationName, MutationPayloadFor<S, MutationName>, MutationParams>({
      queryStore: this.queryStore,
      queryUpdateHooks: this.queryUpdateHooks,
      mutationHandler: this.handleMutation,
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

    return this.handleQuery<typeof query>(query as typeof query & Partial<S['QueryInputMap']>) as Promise<
      QueryResponse<S, typeof query>
    >;
  }

  public mutation<
    const MutationName extends MutationNameFor<S>,
  >(mutationName: MutationName, input: MutationPayloadFor<S, MutationName>) {
    const mutation = singleMutationInput(mutationName, {
      input,
    } as unknown as MutationInputFor<S, MutationName>);

    return this.handleMutation(mutation as any).then((response) => {
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
