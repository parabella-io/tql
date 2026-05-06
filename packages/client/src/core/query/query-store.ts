import { createStore, Mutate, StoreApi } from 'zustand/vanilla';
import { immer } from 'zustand/middleware/immer';
import stableStringify from 'fast-json-stable-stringify';
import md5 from 'md5';
import { produce } from 'immer';
import type { FormattedTQLServerError, ResolvedPagingInfoShape } from '@tql/server/shared';
import { subscribeWithSelector } from 'zustand/middleware';

type QueryData = Record<string, any> | Array<Record<string, any>> | null | undefined;

type QueryError = FormattedTQLServerError | null;

type WithSelector = [
  ['zustand/subscribeWithSelector', never]
]



export type QueryState = {
  queryName: string;
  queryKey: string;
  queryHashKey: QueryHashKey;
  query: any;
  data: QueryData;
  /** Present for paginated `queryMany` responses; `null` otherwise. */
  pagingInfo: ResolvedPagingInfoShape | null;
  params: Record<string, any>;
  error: QueryError;
  isEnabled: boolean;
  isLoading: boolean;
  isStale: boolean;
  staleTimeInMs: number;
  staleAtTimestamp: number | null;
};

export type QueryHashKey = string;

export type QueryStoreState = {
  state: Record<QueryHashKey, QueryState>;
};

export type QueryActions = {
  setRegister: (hashKey: QueryHashKey, queryState: QueryState) => void;
  setState: (keys: QueryHashKey[] | QueryHashKey, state: QueryState) => void;
  setStates: (states: Record<QueryHashKey, QueryState>) => void;
  setData: (keys: QueryHashKey[] | QueryHashKey, updator: (prevData: any) => any) => void;
  setLoading: (keys: QueryHashKey[] | QueryHashKey, isLoading: boolean) => void;
  updateState: (keys: QueryHashKey[] | QueryHashKey, updator: (prevState: QueryState) => QueryState | void) => void;
  getData: (hashKey: QueryHashKey) => QueryData;
  reset: () => void;
};

export type QueryStore = Mutate<
  StoreApi<QueryStoreState & QueryActions>,
  WithSelector
>;

export const createQueryStore = (): QueryStore => {
  return createStore<QueryStoreState & QueryActions>()(
    subscribeWithSelector(immer((set, get) => ({
      state: {},
      setRegister: (hashKey: QueryHashKey, queryState: QueryState) =>
        set((state) => {
          if (state.state[hashKey]) {
            return;
          }

          state.state[hashKey] = queryState;
        }),
      setState: (keys: QueryHashKey[] | QueryHashKey, queryState: QueryState) =>
        set((state) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];

          for (const key of keysArray) {
            state.state[key] = queryState;
          }
        }),

      setStates: (states: Record<QueryHashKey, QueryState>) =>
        set((state) => {
          state.state = states;
        }),
      setLoading: (keys: string[] | string, isLoading: boolean) =>
        set((state) => {
          const keysArray = Array.isArray(keys) ? keys : [keys];
          for (const key of keysArray) {
            if (state.state[key]) {
              state.state[key].isLoading = isLoading;
            }
          }
        }),
      setData: (keys: string[] | string, updator: (prevData: QueryData) => QueryData) =>
        set(
          produce((state) => {
            const keysArray = Array.isArray(keys) ? keys : [keys];

            for (const key of keysArray) {
              if (state.state[key]) {
                state.state[key].data = produce(state.state[key].data ?? {}, (draft: QueryData) => {
                  const result = updator(draft);
                  if (typeof result !== 'undefined') {
                    return result;
                  }
                });
              }
            }
          }),
        ),
      updateState: (keys: QueryHashKey[] | QueryHashKey, updator: (prevState: QueryState) => QueryState | void) =>
        set(
          produce((state) => {
            const keysArray = Array.isArray(keys) ? keys : [keys];

            for (const key of keysArray) {
              if (state.state[key]) {
                state.state[key] = produce(state.state[key] ?? {}, (draft: QueryState) => {
                  const result = updator(draft);
                  if (typeof result !== 'undefined') {
                    return result;
                  }
                });
              }
            }
          }),
        ),
      getData: (hashKey: QueryHashKey) => get().state[hashKey]?.data,
      reset: () => set({ state: {} }),
    }))),
  );
};

export const createQueryHashKey = (queryKey: string, query: any) => {
  const string = stableStringify({
    queryKey,
    query,
  });

  return md5(string);
};

export const createMutationHashKey = (mutationKey: string, mutation: any) => {
  const string = stableStringify({
    mutationKey,
    mutation,
  });

  return md5(string);
};
