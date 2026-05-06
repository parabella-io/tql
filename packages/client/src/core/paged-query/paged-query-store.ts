import { produce } from 'immer';
import { createStore, Mutate, StoreApi } from 'zustand/vanilla';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import stableStringify from 'fast-json-stable-stringify';
import md5 from 'md5';
import type { FormattedTQLServerError, ResolvedPagingInfoShape } from '@tql/server/shared';

export type PagingInfoIn = {
  take?: number;
  before?: string | null;
  after?: string | null;
};

export type PagedQueryChunk<T = unknown> = {
  data: T[];
  pagingInfo: ResolvedPagingInfoShape;
};

export type PagedQueryHashKey = string;

export type PagedQueryState = {
  queryName: string;
  queryKey: string;
  queryHashKey: PagedQueryHashKey;
  query: any;
  params: Record<string, any>;
  pages: PagedQueryChunk<any>[];
  pageIndex: number;
  pageSize: number;
  pagingInfo: ResolvedPagingInfoShape | null;
  error: FormattedTQLServerError | null;
  isEnabled: boolean;
  isLoading: boolean;
  isStale: boolean;
  staleTimeInMs: number;
  staleAtTimestamp: number | null;
};

type WithSelector = [['zustand/subscribeWithSelector', never]];

export type PagedQueryStoreState = {
  state: Record<PagedQueryHashKey, PagedQueryState>;
};

export type PagedQueryActions = {
  setRegister: (hashKey: PagedQueryHashKey, queryState: PagedQueryState) => void;
  setState: (keys: PagedQueryHashKey[] | PagedQueryHashKey, queryState: PagedQueryState) => void;
  setStates: (states: Record<PagedQueryHashKey, PagedQueryState>) => void;
  updateState: (keys: PagedQueryHashKey[] | PagedQueryHashKey, updator: (prevState: PagedQueryState) => PagedQueryState | void) => void;
  replacePages: (hashKey: PagedQueryHashKey, pages: PagedQueryChunk<any>[], pageIndex?: number) => void;
  appendPage: (hashKey: PagedQueryHashKey, page: PagedQueryChunk<any>) => void;
  prependPage: (hashKey: PagedQueryHashKey, page: PagedQueryChunk<any>) => void;
  resetState: (hashKey: PagedQueryHashKey) => void;
  reset: () => void;
};

export type PagedQueryStore = Mutate<StoreApi<PagedQueryStoreState & PagedQueryActions>, WithSelector>;

export function combinePagingInfo(pages: PagedQueryChunk<any>[]): ResolvedPagingInfoShape | null {
  if (pages.length === 0) return null;

  const first = pages[0]!;
  const last = pages[pages.length - 1]!;

  return {
    hasPreviousPage: first.pagingInfo.hasPreviousPage,
    startCursor: first.pagingInfo.startCursor,
    hasNextPage: last.pagingInfo.hasNextPage,
    endCursor: last.pagingInfo.endCursor,
  };
}

const clampPageIndex = (pageIndex: number, pages: PagedQueryChunk<any>[]) => {
  if (pages.length === 0) return 0;
  return Math.min(Math.max(pageIndex, 0), pages.length - 1);
};

export const createPagedQueryStore = (): PagedQueryStore => {
  return createStore<PagedQueryStoreState & PagedQueryActions>()(
    subscribeWithSelector(
      immer((set) => ({
        state: {},
        setRegister: (hashKey: PagedQueryHashKey, queryState: PagedQueryState) =>
          set((state) => {
            if (state.state[hashKey]) {
              return;
            }

            state.state[hashKey] = queryState;
          }),
        setState: (keys: PagedQueryHashKey[] | PagedQueryHashKey, queryState: PagedQueryState) =>
          set((state) => {
            const keysArray = Array.isArray(keys) ? keys : [keys];

            for (const key of keysArray) {
              state.state[key] = queryState;
            }
          }),
        setStates: (states: Record<PagedQueryHashKey, PagedQueryState>) =>
          set((state) => {
            state.state = states;
          }),
        updateState: (keys: PagedQueryHashKey[] | PagedQueryHashKey, updator: (prevState: PagedQueryState) => PagedQueryState | void) =>
          set(
            produce((state) => {
              const keysArray = Array.isArray(keys) ? keys : [keys];

              for (const key of keysArray) {
                if (state.state[key]) {
                  state.state[key] = produce(state.state[key], (draft: PagedQueryState) => {
                    const result = updator(draft);
                    if (typeof result !== 'undefined') {
                      return result;
                    }
                  });
                }
              }
            }),
          ),
        replacePages: (hashKey: PagedQueryHashKey, pages: PagedQueryChunk<any>[], pageIndex = 0) =>
          set((state) => {
            const queryState = state.state[hashKey];
            if (!queryState) return;

            queryState.pages = pages;
            queryState.pageIndex = clampPageIndex(pageIndex, pages);
            queryState.pagingInfo = combinePagingInfo(pages);
          }),
        appendPage: (hashKey: PagedQueryHashKey, page: PagedQueryChunk<any>) =>
          set((state) => {
            const queryState = state.state[hashKey];
            if (!queryState) return;

            queryState.pages.push(page);
            queryState.pageIndex = queryState.pages.length - 1;
            queryState.pagingInfo = combinePagingInfo(queryState.pages);
          }),
        prependPage: (hashKey: PagedQueryHashKey, page: PagedQueryChunk<any>) =>
          set((state) => {
            const queryState = state.state[hashKey];
            if (!queryState) return;

            queryState.pages.unshift(page);
            queryState.pageIndex = 0;
            queryState.pagingInfo = combinePagingInfo(queryState.pages);
          }),
        resetState: (hashKey: PagedQueryHashKey) =>
          set((state) => {
            const queryState = state.state[hashKey];
            if (!queryState) return;

            queryState.pages = [];
            queryState.pageIndex = 0;
            queryState.pagingInfo = null;
            queryState.error = null;
            queryState.isStale = true;
            queryState.staleAtTimestamp = null;
          }),
        reset: () => set({ state: {} }),
      })),
    ),
  );
};

export const createPagedQueryHashKey = (queryKey: string, query: any) => {
  const string = stableStringify({
    queryKey,
    query,
  });

  return md5(string);
};
