import { produce } from 'immer';
import { Query } from './query';
import { ClientSchema, QueryDataFor, QueryInputFor, QueryNameFor } from './query.types';
import { QueryStore } from './query-store';

export const createOptimisticUpdate = (store: QueryStore): OptimisticQueryStore => {
  let optimisticUpdates: Record<string, any> = {};

  let applied = false;

  let snapshot: Record<string, any> = {};

  return {
    getAll: (query: Query<any, any, any, any>) => {
      const hashKeys = query.getAllHashKeys();

      return {
        update(updater) {
          for (const hashKey of hashKeys) {
            const existingData = optimisticUpdates[hashKey] ?? store.getState().getData(hashKey);
            const updatedState = produce(existingData, updater);
            optimisticUpdates[hashKey] = updatedState;
          }
        },
      };
    },
    get: (query: Query<any, any, any, any>, params: Record<string, any>) => {
      const hashKey = query.getHashKey(params);

      return {
        update(updater) {
          const existingData = optimisticUpdates[hashKey] ?? query.getData(params);
          const updatedState = produce(existingData, updater);
          optimisticUpdates[hashKey] = updatedState;
        },
      };
    },
    where: (query: Query<any, any, any, any>, partialParams: Record<string, any>) => {
      const hashKeys = query.getHashKeysWhere(partialParams);

      return {
        update(updater) {
          for (const hashKey of hashKeys) {
            const existingData = optimisticUpdates[hashKey] ?? store.getState().getData(hashKey);
            const updatedState = produce(existingData, updater);
            optimisticUpdates[hashKey] = updatedState;
          }
        },
      };
    },
    start: () => {
      snapshot = store.getState().state;
    },
    commit: () => {
      if (applied) {
        throw new Error('Optimistic updates have already been applied');
      }

      const updatedState = produce(store.getState().state, (draftState) => {
        for (const hashKey in optimisticUpdates) {
          if (draftState[hashKey]) {
            draftState[hashKey].data = optimisticUpdates[hashKey];
          }
        }
      });

      store.setState({
        state: updatedState,
      });

      applied = true;

      return optimisticUpdates;
    },
    rollback: () => {
      store.setState({
        state: snapshot,
      });

      applied = false;
    },
  };
};

export type OptimisticQueryStore = {
  getAll: <
    S extends ClientSchema,
    QueryName extends QueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(
    query: Query<S, QueryName, QueryInput, QueryParams>,
  ) => OptimisticQueryStoreUpdater<S, QueryName, QueryInput>;
  get: <
    S extends ClientSchema,
    QueryName extends QueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(
    query: Query<S, QueryName, QueryInput, QueryParams>,
    params: QueryParams,
  ) => OptimisticQueryStoreUpdater<S, QueryName, QueryInput>;
  where: <
    S extends ClientSchema,
    QueryName extends QueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(
    query: Query<S, QueryName, QueryInput, QueryParams>,
    params: QueryParams,
  ) => OptimisticQueryStoreUpdater<S, QueryName, QueryInput>;
  start: () => void;
  rollback: () => void;
  commit: () => Record<string, any>;
};

export type OptimisticQueryStoreUpdater<
  S extends ClientSchema,
  QueryName extends QueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
> = {
  update: (updater: (draft: QueryDataFor<S, QueryName, QueryInput>) => void | QueryDataFor<S, QueryName, QueryInput>) => void;
};
