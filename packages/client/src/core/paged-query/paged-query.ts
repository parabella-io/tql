import { produce } from 'immer';
import type { FormattedTQLServerError, ResolvedPagingInfoShape } from '@tql/server/shared';
import type { ClientHandleQuery } from '../client/client';
import { deepPartialMatch } from '../utils';
import { singleQueryInput } from '../query/query';
import type { ClientSchema, QueryInputFor, SingleQueryRequestFor } from '../query/query.types';
import {
  combinePagingInfo,
  createPagedQueryHashKey,
  PagedQueryChunk,
  PagedQueryHashKey,
  PagedQueryState,
  PagedQueryStore,
  PagingInfoIn,
} from './paged-query-store';
import type { PagedQueryEntityFor, PagedQueryNameFor, PagedQueryOptions, PagedQueryResponse } from './paged-query.types';

export type PagedQueryConstructor<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> = {
  store: PagedQueryStore;
  queryName: QueryName;
  queryOptions: PagedQueryOptions<S, QueryName, QueryInput, QueryParams>;
  queryHandler: ClientHandleQuery<S>;
};

type PageDirection = 'replace' | 'append' | 'prepend';

const EMPTY_PAGING_INFO: ResolvedPagingInfoShape = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
};

export class PagedQuery<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> {
  private readonly queryKey: string;
  private readonly queryName: QueryName;
  private readonly queryOptions: PagedQueryOptions<S, QueryName, QueryInput, QueryParams>;
  private readonly queryHandler: ClientHandleQuery<S>;
  private readonly store: PagedQueryStore;
  private readonly setRegister: (hashKey: PagedQueryHashKey, queryState: PagedQueryState) => void;
  private readonly inFlightQueries: Map<string, Promise<PagedQueryResponse<S, QueryName, QueryInput>>> = new Map();

  constructor(readonly options: PagedQueryConstructor<S, QueryName, QueryInput, QueryParams>) {
    const { store, queryName, queryOptions, queryHandler } = options;

    this.queryKey = queryOptions.queryKey;
    this.queryName = queryName;
    this.queryOptions = queryOptions;
    this.queryHandler = queryHandler;
    this.store = store;
    this.setRegister = store.getState().setRegister;
  }

  private ensureRegistered(params: QueryParams): { hashKey: PagedQueryHashKey; state: PagedQueryState; didRegister: boolean } {
    const hashKey = this.getHashKey(params);
    const existing = this.store.getState().state[hashKey] as PagedQueryState | undefined;

    if (existing) {
      return { hashKey, state: existing, didRegister: false };
    }

    const staleTimeInMs = this.queryOptions.staleTimeInMs ?? 0;
    const initialPagingInfo = this.initialPagingInfo();
    const next: PagedQueryState = {
      queryName: this.queryName,
      queryKey: this.queryKey,
      queryHashKey: hashKey,
      query: this.queryOptions.query(params, initialPagingInfo),
      params,
      pages: [],
      pageIndex: 0,
      pageSize: this.queryOptions.pageSize,
      pagingInfo: null,
      error: null,
      isEnabled: this.queryOptions.isEnabled ?? true,
      isLoading: false,
      isStale: true,
      staleAtTimestamp: null,
      staleTimeInMs,
    };

    this.setRegister(hashKey, next);

    return { hashKey, state: next, didRegister: true };
  }

  private initialPagingInfo(): PagingInfoIn {
    return { take: this.queryOptions.pageSize };
  }

  private isStale(state: PagedQueryState): boolean {
    return state.staleAtTimestamp === null || state.staleAtTimestamp < Date.now();
  }

  private patchState(hashKey: PagedQueryHashKey, patch: Partial<PagedQueryState>): void {
    this.store.getState().updateState(hashKey, (draft) => {
      for (const key of Object.keys(patch) as (keyof PagedQueryState)[]) {
        const next = patch[key];

        if (!Object.is(draft[key], next)) {
          draft[key] = next as never;
        }
      }
    });
  }

  private inFlightKey(hashKey: PagedQueryHashKey, pagingInfo: PagingInfoIn) {
    return `${hashKey}:${JSON.stringify({
      take: pagingInfo.take ?? this.queryOptions.pageSize,
      before: pagingInfo.before ?? null,
      after: pagingInfo.after ?? null,
    })}`;
  }

  private async fetchPage(
    params: QueryParams,
    pagingInfo: PagingInfoIn,
    direction: PageDirection,
  ): Promise<PagedQueryResponse<S, QueryName, QueryInput>> {
    const { hashKey } = this.ensureRegistered(params);

    const requestPagingInfo: PagingInfoIn = {
      ...pagingInfo,
      take: pagingInfo.take ?? this.queryOptions.pageSize,
    };

    const inFlightKey = this.inFlightKey(hashKey, requestPagingInfo);

    const existingPromise = this.inFlightQueries.get(inFlightKey);

    if (existingPromise) {
      return existingPromise;
    }

    const requestInput = this.queryOptions.query(params, requestPagingInfo);
    const request = singleQueryInput(this.queryName, requestInput) as SingleQueryRequestFor<S, QueryName, QueryInput>;
    const now = Date.now();
    const stateTimeInMs = this.getState(params).staleTimeInMs;
    const staleAtTimestamp = stateTimeInMs > 0 ? now + stateTimeInMs : null;

    const executionPromise = (async () => {
      try {
        this.patchState(hashKey, {
          query: requestInput,
          isLoading: true,
        });

        const response = await this.queryHandler<typeof request>(request as typeof request & Partial<S['QueryInputMap']>);

        if (!response) throw new Error(`PagedQuery [${this.queryName}]: invalid response`);

        const queryResponse = response[this.queryName] as {
          data: unknown;
          error: FormattedTQLServerError | null;
          pagingInfo?: ResolvedPagingInfoShape | null;
        };

        if (!queryResponse) throw new Error(`PagedQuery [${this.queryName}]: invalid response`);

        const { data, error } = queryResponse;

        if (data === null || typeof data === 'undefined') throw new Error(`PagedQuery [${this.queryName}]: invalid response`);

        if (!Array.isArray(data)) throw new Error(`PagedQuery [${this.queryName}]: expected array data`);

        if (error) throw error;

        const paging = queryResponse.pagingInfo ?? EMPTY_PAGING_INFO;

        const page: PagedQueryChunk<PagedQueryEntityFor<S, QueryName, QueryInput>> = {
          data: data as PagedQueryEntityFor<S, QueryName, QueryInput>[],
          pagingInfo: paging,
        };

        if (direction === 'append') {
          this.store.getState().appendPage(hashKey, page);
        } else if (direction === 'prepend') {
          this.store.getState().prependPage(hashKey, page);
        } else {
          this.store.getState().replacePages(hashKey, [page], 0);
        }

        this.patchState(hashKey, {
          error,
          isStale: false,
          isLoading: false,
          staleAtTimestamp,
        });

        return response as PagedQueryResponse<S, QueryName, QueryInput>;
      } catch (error) {
        const formattedError = { type: 'unknown', details: { message: 'Unknown error', fullError: error } } as FormattedTQLServerError;

        this.patchState(hashKey, {
          error: formattedError,
          isLoading: false,
          staleAtTimestamp,
        });

        throw error;
      } finally {
        this.inFlightQueries.delete(inFlightKey);
      }
    })();

    this.inFlightQueries.set(inFlightKey, executionPromise);

    return executionPromise;
  }

  public register(params: QueryParams): PagedQueryHashKey {
    const { hashKey, state, didRegister } = this.ensureRegistered(params);

    if (didRegister && this.isStale(state)) {
      void this.execute(params);
    }

    return hashKey;
  }

  public execute(params: QueryParams): Promise<PagedQueryResponse<S, QueryName, QueryInput>> {
    return this.fetchPage(params, this.initialPagingInfo(), 'replace');
  }

  public loadNextPage(params: QueryParams): Promise<PagedQueryResponse<S, QueryName, QueryInput> | null> {
    const state = this.getState(params);

    const pagingInfo = state.pagingInfo;

    if (!pagingInfo?.hasNextPage || pagingInfo.endCursor === null) {
      return Promise.resolve(null);
    }

    return this.fetchPage(
      params,
      {
        take: state.pageSize,
        after: pagingInfo.endCursor,
      },
      'append',
    );
  }

  public loadPreviousPage(params: QueryParams): Promise<PagedQueryResponse<S, QueryName, QueryInput> | null> {
    const state = this.getState(params);

    const pagingInfo = state.pagingInfo;

    if (!pagingInfo?.hasPreviousPage || pagingInfo.startCursor === null) {
      return Promise.resolve(null);
    }

    return this.fetchPage(
      params,
      {
        take: state.pageSize,
        before: pagingInfo.startCursor,
      },
      'prepend',
    );
  }

  public async goToPage(params: QueryParams, pageIndex: number): Promise<void> {
    const targetIndex = Math.max(0, pageIndex);

    let state = this.getState(params);

    while (targetIndex >= state.pages.length && state.pagingInfo?.hasNextPage) {
      await this.loadNextPage(params);
      state = this.getState(params);
    }

    this.setActivePage(params, targetIndex);
  }

  public setActivePage(params: QueryParams, pageIndex: number): void {
    const hashKey = this.getHashKey(params);

    this.store.getState().updateState(hashKey, (draft) => {
      if (draft.pages.length === 0) {
        draft.pageIndex = 0;
        return;
      }

      draft.pageIndex = Math.min(Math.max(pageIndex, 0), draft.pages.length - 1);
    });
  }

  public reset(params: QueryParams): Promise<PagedQueryResponse<S, QueryName, QueryInput>> {
    const hashKey = this.register(params);

    this.store.getState().resetState(hashKey);

    return this.execute(params);
  }

  public addToStart(params: QueryParams, itemOrItems: any | any[]): void {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

    const { hashKey } = this.ensureRegistered(params);

    this.store.getState().updateState(hashKey, (draft) => {
      if (draft.pages.length === 0) {
        draft.pages.push({ data: items, pagingInfo: EMPTY_PAGING_INFO });
      } else {
        draft.pages[0]!.data.unshift(...items);
      }

      draft.pagingInfo = combinePagingInfo(draft.pages);
    });
  }

  public addToEnd(params: QueryParams, itemOrItems: any | any[]): void {
    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

    const { hashKey } = this.ensureRegistered(params);

    this.store.getState().updateState(hashKey, (draft) => {
      if (draft.pages.length === 0) {
        draft.pages.push({ data: items, pagingInfo: EMPTY_PAGING_INFO });
      } else {
        draft.pages[draft.pages.length - 1]!.data.push(...items);
      }

      draft.pagingInfo = combinePagingInfo(draft.pages);
    });
  }

  public update(params: QueryParams, updator: (draft: PagedQueryChunk<any>[]) => PagedQueryChunk<any>[] | void): void {
    const { hashKey } = this.ensureRegistered(params);

    this.store.getState().updateState(hashKey, (draft) => {
      draft.pages = produce(draft.pages, updator as any);
      draft.pageIndex = draft.pages.length === 0 ? 0 : Math.min(draft.pageIndex, draft.pages.length - 1);
      draft.pagingInfo = combinePagingInfo(draft.pages);
    });
  }

  public removeWhere(params: QueryParams, predicate: (item: PagedQueryEntityFor<S, QueryName, QueryInput>) => boolean): void {
    this.update(params, (draft) => {
      for (const page of draft) {
        page.data = page.data.filter((item) => !predicate(item));
      }
    });
  }

  public getState(params: QueryParams): PagedQueryState {
    const { state } = this.store.getState();

    const queryHashKey = this.getHashKey(params);

    const queryState = state[queryHashKey];

    if (!queryState) {
      throw new Error(`PagedQuery [${this.queryName}]: not registered`);
    }

    return queryState as PagedQueryState;
  }

  public getStateOrNull(params: QueryParams): PagedQueryState | null {
    const { state } = this.store.getState();

    const queryHashKey = this.getHashKey(params);

    const queryState = state[queryHashKey];

    if (!queryState) {
      return null;
    }

    return queryState as PagedQueryState;
  }

  public getData = (params: QueryParams): PagedQueryEntityFor<S, QueryName, QueryInput>[] => {
    const state = this.getState(params);
    return (state.pages[state.pageIndex]?.data ?? []) as PagedQueryEntityFor<S, QueryName, QueryInput>[];
  };

  public getAllData = (params: QueryParams): PagedQueryEntityFor<S, QueryName, QueryInput>[] => {
    return this.getState(params).pages.flatMap((page) => page.data) as PagedQueryEntityFor<S, QueryName, QueryInput>[];
  };

  public getError = (params: QueryParams): FormattedTQLServerError | null => {
    return this.getState(params).error;
  };

  public getPagingInfo = (params: QueryParams): ResolvedPagingInfoShape | null => {
    return this.getState(params).pagingInfo;
  };

  public getHashKey = (params: QueryParams) => {
    return createPagedQueryHashKey(this.queryKey, params);
  };

  public subscribe = (params: QueryParams, callback: (queryState: PagedQueryState) => void) => {
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
    const queryHashKeys: PagedQueryHashKey[] = [];

    const state = this.store.getState().state;

    for (const { queryHashKey, queryName } of Object.values(state)) {
      if (queryName === this.queryName) {
        queryHashKeys.push(queryHashKey);
      }
    }

    return queryHashKeys;
  };

  public getHashKeysWhere = (partialParams: Partial<QueryParams>) => {
    const queryHashKeys: PagedQueryHashKey[] = [];

    const state = this.store.getState().state;

    for (const { params, queryHashKey, queryName } of Object.values(state)) {
      if (queryName === this.queryName && deepPartialMatch(params, partialParams)) {
        queryHashKeys.push(queryHashKey);
      }
    }

    return queryHashKeys;
  };
}
