import type { FormattedTQLServerError } from '@tql/server/shared';
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
import { produce } from 'immer';
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
  private readonly setState: (hashKey: QueryHashKey, query: QueryState) => void;
  private readonly setRegister: (hashKey: QueryHashKey, queryState: QueryState) => void;
  private readonly inFlightQueries: Map<QueryHashKey, Promise<any>> = new Map();

  constructor(readonly options: QueryConstructor<S, QueryName, QueryInput, QueryParams>) {
    const { store, queryName, queryOptions, queryHandler, queryUpdateHooks } = options;

    this.queryKey = queryOptions.queryKey as any;
    this.queryName = queryName;
    this.queryOptions = queryOptions;
    this.queryHandler = queryHandler;
    this.store = store;
    this.setState = store.getState().setState;
    this.setRegister = store.getState().setRegister;
    this.queryUpdateHooks = queryUpdateHooks;
  }

  public register(params: QueryParams): QueryHashKey {
    const query = this.queryOptions.query(params);
    const isEnabled = this.queryOptions.isEnabled ?? true;
    const staleTimeInMs = this.queryOptions.staleTimeInMs ?? 0;
    const staleAtTimestamp = staleTimeInMs > 0 ? Date.now() - 1000 : null;
    const queryHashKey = this.getHashKey(params);

    if (this.getStateOrNull(params)) {
      console.log(`Query [${this.queryName}]: query already registered`);
      return queryHashKey;
    }

    this.setRegister(queryHashKey, {
      queryName: this.queryName,
      queryKey: this.queryKey,
      queryHashKey,
      query,
      params,
      error: null,
      data: null,
      isEnabled,
      isLoading: false,
      isStale: true,
      staleAtTimestamp,
      staleTimeInMs,
    });

    this.checkIfStale(params);

    return queryHashKey;
  }

  public checkIfStale(params: QueryParams) {
    console.log(`Query [${this.queryName}]: checkIfStale`);

    const { state } = this.store.getState();

    const _hashKey = this.getHashKey(params);

    const queryState = state[_hashKey] as QueryState;

    if (!queryState) {
      throw new Error(`Query [${this.queryName}]: not registered`);
    }

    if (queryState.staleAtTimestamp === null || (queryState.staleAtTimestamp && queryState.staleAtTimestamp < Date.now())) {
      this.setState(_hashKey, {
        ...queryState,
        isStale: true,
      });

      this.execute(params);
    }
  }

  public async execute(params: QueryParams): Promise<QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>> {
    this.register(params);

    const queryHashKey = this.getHashKey(params);

    const existingPromise = this.inFlightQueries.get(queryHashKey);

    if (existingPromise) {
      return existingPromise as Promise<QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>>;
    }

    const queryInput = this.queryOptions.query(params);
    const queryState = this.getState(params);
    const request = singleQueryInput(queryState.queryName, queryInput) as SingleQueryRequestFor<S, QueryName, QueryInput>;

    const now = Date.now();
    const stateTimeInMs = queryState.staleTimeInMs;
    const staleAtTimestamp = stateTimeInMs > 0 ? now + stateTimeInMs : null;

    const executionPromise = (async () => {
      try {
        this.setState(queryHashKey, {
          ...queryState,
          isLoading: true,
        });

        const response = await this.queryHandler<typeof request>(request as typeof request & Partial<S['QueryInputMap']>);

        if (!response) throw new Error(`Query [${this.queryName}]: invalid response`);

        const queryResponse = response[queryState.queryName];

        const { data, error } = queryResponse;

        if (!data) throw new Error(`Query [${this.queryName}]: invalid response`);

        if (error) throw error;

        this.setState(queryHashKey, {
          ...queryState,
          data,
          error,
          isStale: false,
          isLoading: false,
          staleAtTimestamp,
        });

        return response as QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>;
      } catch (error) {
        const formattedError = { type: 'unknown', details: { message: 'Unknown error', fullError: error } } as FormattedTQLServerError;

        this.setState(queryHashKey, {
          ...queryState,
          error: formattedError,
          isLoading: false,
          staleAtTimestamp,
        });

        throw error;
      } finally {
        this.inFlightQueries.delete(queryHashKey);
      }
    })();

    this.inFlightQueries.set(queryHashKey, executionPromise);

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

    this.setState(queryHashKey, produce(this.getState(params), updator));
  };

  public getData = (params: QueryParams): QueryDataFor<S, QueryName, QueryInput> => {
    return this.getState(params).data as QueryDataFor<S, QueryName, QueryInput>;
  };

  public getError = (params: QueryParams): FormattedTQLServerError | null => {
    return this.getState(params).error as FormattedTQLServerError | null;
  };

  public getHashKey = (params: QueryParams) => {
    return createQueryHashKey(this.queryKey, this.queryOptions.query(params));
  };

  public subscribe = (params: QueryParams, callback: (queryState: QueryState) => void) => {
    const queryHashKey = this.getHashKey(params);

    return this.store.subscribe((state) => state.state[queryHashKey], (currentState) => {
      if (currentState) {
        callback(currentState);
      }
    });
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
