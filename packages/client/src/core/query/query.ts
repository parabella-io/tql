import type { FormattedTQLServerError, ResolvedPagingInfoShape } from '@tql/server/shared';
import { createQueryHashKey, QueryHashKey, QueryState, QueryStore } from './query-store';

import type {
  ClientSchema,
  QueryNameFor,
  QueryInputFor,
  QueryOptions,
  QueryDataFor,
  QueryModelNameFor,
  QueryModelUpdateHook,
  QueryModelShapeFor,
  QueryResponse,
  SingleQueryRequestFor,
  QueryUpdateHooksMap,
} from './query.types';
import { deepPartialMatch } from '../utils';
import { ClientHandleQuery } from '../client/client';

export type QueryConstructor<
  S extends ClientSchema,
  QueryName extends QueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> = {
  store: QueryStore;
  queryName: QueryName;
  queryOptions: QueryOptions<S, QueryName, QueryInput, QueryParams>;
  queryHandler: ClientHandleQuery<S>;
  queryUpdateHooks: QueryUpdateHooksMap;
};

export class Query<
  S extends ClientSchema,
  QueryName extends QueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> {
  private readonly queryKey: string;
  private readonly queryName: QueryName;
  private readonly queryOptions: QueryOptions<S, QueryName, QueryInput, QueryParams>;
  private readonly store: QueryStore;

  private readonly queryHandler: ClientHandleQuery<S>;
  private readonly queryUpdateHooks: QueryUpdateHooksMap;
  private readonly setRegister: (hashKey: QueryHashKey, queryState: QueryState) => void;
  private readonly inFlightQueries: Map<QueryHashKey, Promise<any>> = new Map();

  constructor(readonly options: QueryConstructor<S, QueryName, QueryInput, QueryParams>) {
    const { store, queryName, queryOptions, queryHandler, queryUpdateHooks } = options;

    this.queryKey = queryOptions.queryKey as any;
    this.queryName = queryName;
    this.queryOptions = queryOptions;
    this.queryHandler = queryHandler;
    this.store = store;
    this.setRegister = store.getState().setRegister;
    this.queryUpdateHooks = queryUpdateHooks;
  }

  private ensureRegistered(params: QueryParams): { hashKey: QueryHashKey; state: QueryState; didRegister: boolean } {
    const hashKey = this.getHashKey(params);

    const existing = this.store.getState().state[hashKey] as QueryState | undefined;

    if (existing) {
      return { hashKey, state: existing, didRegister: false };
    }

    const staleTimeInMs = this.queryOptions.staleTimeInMs ?? 0;

    const next: QueryState = {
      queryName: this.queryName,
      queryKey: this.queryKey,
      queryHashKey: hashKey,
      query: this.queryOptions.query(params),
      params,
      error: null,
      data: null,
      pagingInfo: null,
      isEnabled: this.queryOptions.isEnabled ?? true,
      isLoading: false,
      isStale: true,
      staleAtTimestamp: null,
      staleTimeInMs,
    };

    this.setRegister(hashKey, next);

    return { hashKey, state: next, didRegister: true };
  }

  private isStale(state: QueryState): boolean {
    return state.staleAtTimestamp === null || state.staleAtTimestamp < Date.now();
  }

  private patchState(hashKey: QueryHashKey, patch: Partial<QueryState>): void {
    this.store.getState().updateState(hashKey, (draft) => {
      for (const key of Object.keys(patch) as (keyof QueryState)[]) {
        const next = patch[key];

        if (!Object.is(draft[key], next)) {
          draft[key] = next as never;
        }
      }
    });
  }

  public register(params: QueryParams): QueryHashKey {
    const { hashKey, state, didRegister } = this.ensureRegistered(params);

    if (didRegister && this.isStale(state)) {
      void this.execute(params);
    }

    return hashKey;
  }

  public async execute(params: QueryParams): Promise<QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>> {
    const { hashKey, state } = this.ensureRegistered(params);

    const existingPromise = this.inFlightQueries.get(hashKey);

    if (existingPromise) {
      return existingPromise as Promise<QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>>;
    }

    const request = singleQueryInput(state.queryName, state.query) as SingleQueryRequestFor<S, QueryName, QueryInput>;

    const now = Date.now();
    const stateTimeInMs = state.staleTimeInMs;
    const staleAtTimestamp = stateTimeInMs > 0 ? now + stateTimeInMs : null;

    const executionPromise = (async () => {
      try {
        this.patchState(hashKey, { isLoading: true });

        const response = await this.queryHandler<typeof request>(request as typeof request & Partial<S['QueryInputMap']>);

        if (!response) throw new Error(`Query [${this.queryName}]: invalid response`);

        const queryResponse = response[state.queryName] as {
          data: unknown;
          error: FormattedTQLServerError | null;
          pagingInfo?: ResolvedPagingInfoShape | null;
        };

        const { data, error } = queryResponse;

        if (!data) throw new Error(`Query [${this.queryName}]: invalid response`);

        if (error) throw error;

        const pagingInfo = queryResponse.pagingInfo ?? null;

        this.patchState(hashKey, {
          data,
          error,
          pagingInfo,
          isStale: false,
          isLoading: false,
          staleAtTimestamp,
        });

        return response as QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>;
      } catch (error) {
        const formattedError = { type: 'unknown', details: { message: 'Unknown error', fullError: error } } as FormattedTQLServerError;

        this.patchState(hashKey, {
          error: formattedError,
          pagingInfo: null,
          isLoading: false,
          staleAtTimestamp,
        });

        throw error;
      } finally {
        this.inFlightQueries.delete(hashKey);
      }
    })();

    this.inFlightQueries.set(hashKey, executionPromise);

    return executionPromise;
  }

  public getState(params: QueryParams): QueryState {
    const { state } = this.store.getState();

    const queryHashKey = this.getHashKey(params);

    const queryState = state[queryHashKey];

    if (!queryState) {
      throw new Error(`Query [${this.queryName}]: not registered`);
    }

    return queryState as QueryState;
  }

  public getStateOrNull(params: QueryParams): QueryState | null {
    const { state } = this.store.getState();

    const queryHashKey = this.getHashKey(params);

    const queryState = state[queryHashKey];

    if (!queryState) {
      return null;
    }

    return queryState as QueryState | null;
  }

  public updateState = (params: QueryParams, updator: (prevState: QueryState) => QueryState | void) => {
    const queryHashKey = this.getHashKey(params);

    this.store.getState().updateState(queryHashKey, updator);
  };

  public getData = (params: QueryParams): QueryDataFor<S, QueryName, QueryInput> => {
    return this.getState(params).data as QueryDataFor<S, QueryName, QueryInput>;
  };

  public getError = (params: QueryParams): FormattedTQLServerError | null => {
    return this.getState(params).error as FormattedTQLServerError | null;
  };

  public getPagingInfo = (params: QueryParams): ResolvedPagingInfoShape | null => {
    return this.getState(params).pagingInfo;
  };

  public getHashKey = (params: QueryParams) => {
    return createQueryHashKey(this.queryKey, this.queryOptions.query(params));
  };

  public subscribe = (params: QueryParams, callback: (queryState: QueryState) => void) => {
    const queryHashKey = this.getHashKey(params);

    return this.store.subscribe(
      (state) => state.state[queryHashKey],
      (currentState) => {
        if (currentState) {
          callback(currentState);
        }
      },
    );
  };

  public getAllHashKeys = () => {
    const queryHashKeys: QueryHashKey[] = [];

    const state = this.store.getState().state;

    for (const { queryHashKey, queryName } of Object.values(state)) {
      if (queryName === this.queryName) {
        queryHashKeys.push(queryHashKey);
      }
    }

    return queryHashKeys;
  };

  public getHashKeysWhere = (partialParams: QueryParams) => {
    const queryHashKeys: QueryHashKey[] = [];

    const state = this.store.getState().state;

    for (const { params, queryHashKey, queryName } of Object.values(state)) {
      if (queryName === this.queryName && deepPartialMatch(params, partialParams)) {
        queryHashKeys.push(queryHashKey);
      }
    }

    return queryHashKeys;
  };

  public updateOnChange<ModelName extends QueryModelNameFor<S>>(
    modelName: ModelName,
    hooks: QueryModelUpdateHook<S, ModelName, QueryName, QueryModelShapeFor<S, ModelName>, QueryInput, QueryParams>,
  ) {
    if (this.queryUpdateHooks[modelName]?.[this.queryName]) {
      throw new Error(`Query [${this.queryName}]: hook for model ${modelName} already added`);
    }

    const queryUpdateHooks = this.queryUpdateHooks[modelName] ?? {};

    queryUpdateHooks[this.queryName] = {
      queryName: this.queryName,
      modelName,
      hooks,
    };

    this.queryUpdateHooks[modelName] = queryUpdateHooks;
  }
}

export const singleQueryInput = <K extends string, V>(key: K, value: V): { [P in K]: V } => {
  return { [key]: value } as { [P in K]: V };
};
