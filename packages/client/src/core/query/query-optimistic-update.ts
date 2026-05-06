import { produce } from 'immer';
import { Query } from './query';
import { ClientSchema, QueryDataFor, QueryInputFor, QueryNameFor } from './query.types';
import { QueryStore } from './query-store';
import { PagedQuery } from '../paged-query/paged-query';
import { PagedQueryState, PagedQueryStore, PagedQueryChunk, combinePagingInfo } from '../paged-query/paged-query-store';
import { PagedQueryEntityFor, PagedQueryNameFor } from '../paged-query/paged-query.types';

export const createOptimisticUpdate = (store: QueryStore, pagedStore?: PagedQueryStore): OptimisticQueryStore => {
  let optimisticUpdates: Record<string, any> = {};
  let pagedOptimisticUpdates: Record<string, PagedQueryState> = {};

  let applied = false;

  let snapshot: Record<string, any> = {};
  let pagedSnapshot: Record<string, PagedQueryState> = {};

  const requirePagedStore = () => {
    if (!pagedStore) {
      throw new Error('Optimistic paged updates require a paged query store');
    }

    return pagedStore;
  };

  const pagedUpdaterFor = (hashKeys: string[]) => {
    return {
      addToStart(itemOrItems) {
        const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

        const currentPagedStore = requirePagedStore();

        for (const hashKey of hashKeys) {
          const existingState = pagedOptimisticUpdates[hashKey] ?? currentPagedStore.getState().state[hashKey];

          if (!existingState) {
            continue;
          }

          pagedOptimisticUpdates[hashKey] = produce(existingState, (draft) => {
            if (draft.pages.length === 0) {
              draft.pages.push({
                data: items,
                pagingInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              });
            } else {
              draft.pages[0]!.data.unshift(...items);
            }

            draft.pagingInfo = combinePagingInfo(draft.pages);
          });
        }
      },
      addToEnd(itemOrItems) {
        const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

        const currentPagedStore = requirePagedStore();

        for (const hashKey of hashKeys) {
          const existingState = pagedOptimisticUpdates[hashKey] ?? currentPagedStore.getState().state[hashKey];

          if (!existingState) {
            continue;
          }

          pagedOptimisticUpdates[hashKey] = produce(existingState, (draft) => {
            if (draft.pages.length === 0) {
              draft.pages.push({
                data: items,
                pagingInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              });
            } else {
              draft.pages[draft.pages.length - 1]!.data.push(...items);
            }

            draft.pagingInfo = combinePagingInfo(draft.pages);
          });
        }
      },
      update(updater) {
        const currentPagedStore = requirePagedStore();

        for (const hashKey of hashKeys) {
          const existingState = pagedOptimisticUpdates[hashKey] ?? currentPagedStore.getState().state[hashKey];

          if (!existingState) {
            continue;
          }

          pagedOptimisticUpdates[hashKey] = produce(existingState, (draft) => {
            draft.pages = produce(draft.pages, updater as any);
            draft.pageIndex = draft.pages.length === 0 ? 0 : Math.min(draft.pageIndex, draft.pages.length - 1);
            draft.pagingInfo = combinePagingInfo(draft.pages);
          });
        }
      },
    } as OptimisticPagedQueryStoreUpdater<any, any, any>;
  };

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
    paged: (query: PagedQuery<any, any, any, any>, params: Record<string, any>) => {
      return pagedUpdaterFor([query.getHashKey(params)]);
    },
    pagedAll: (query: PagedQuery<any, any, any, any>) => {
      return pagedUpdaterFor(query.getAllHashKeys());
    },
    pagedWhere: (query: PagedQuery<any, any, any, any>, partialParams: Record<string, any>) => {
      return pagedUpdaterFor(query.getHashKeysWhere(partialParams));
    },
    start: () => {
      snapshot = store.getState().state;
      pagedSnapshot = pagedStore?.getState().state ?? {};
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

      if (pagedStore) {
        const updatedPagedState = produce(pagedStore.getState().state, (draftState) => {
          for (const hashKey in pagedOptimisticUpdates) {
            if (draftState[hashKey]) {
              draftState[hashKey] = pagedOptimisticUpdates[hashKey]!;
            }
          }
        });

        pagedStore.setState({
          state: updatedPagedState,
        });
      }

      applied = true;

      return optimisticUpdates;
    },
    rollback: () => {
      store.setState({
        state: snapshot,
      });

      if (pagedStore) {
        pagedStore.setState({
          state: pagedSnapshot,
        });
      }

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
  paged: <
    S extends ClientSchema,
    QueryName extends PagedQueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(
    query: PagedQuery<S, QueryName, QueryInput, QueryParams>,
    params: QueryParams,
  ) => OptimisticPagedQueryStoreUpdater<S, QueryName, QueryInput>;
  pagedAll: <
    S extends ClientSchema,
    QueryName extends PagedQueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(
    query: PagedQuery<S, QueryName, QueryInput, QueryParams>,
  ) => OptimisticPagedQueryStoreUpdater<S, QueryName, QueryInput>;
  pagedWhere: <
    S extends ClientSchema,
    QueryName extends PagedQueryNameFor<S>,
    QueryInput extends QueryInputFor<S, QueryName>,
    QueryParams extends Record<string, any>,
  >(
    query: PagedQuery<S, QueryName, QueryInput, QueryParams>,
    params: Partial<QueryParams>,
  ) => OptimisticPagedQueryStoreUpdater<S, QueryName, QueryInput>;
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

export type OptimisticPagedQueryStoreUpdater<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
> = {
  addToStart: (item: PagedQueryEntityFor<S, QueryName, QueryInput> | PagedQueryEntityFor<S, QueryName, QueryInput>[] | any) => void;
  addToEnd: (item: PagedQueryEntityFor<S, QueryName, QueryInput> | PagedQueryEntityFor<S, QueryName, QueryInput>[] | any) => void;
  update: (updater: (draft: PagedQueryChunk<PagedQueryEntityFor<S, QueryName, QueryInput>>[]) => void | PagedQueryChunk<any>[]) => void;
};
