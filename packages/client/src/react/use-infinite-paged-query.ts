import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { PagedQuery } from '../core/paged-query/paged-query';
import type { PagedQueryChunk } from '../core/paged-query/paged-query-store';

type AnyPagedQuery = PagedQuery<any, any, any, any>;

type PagedQueryParamsFor<QueryType extends AnyPagedQuery> = QueryType extends PagedQuery<any, any, any, infer Params> ? Params : never;

type PagedQueryEntity<QueryType extends AnyPagedQuery> =
  Exclude<ReturnType<QueryType['getAllData']>, null> extends (infer Entity)[] ? Entity : never;

export type UseInfinitePagedQueryResult<QueryType extends AnyPagedQuery> = {
  /** All entities from loaded pages, in order. */
  data: PagedQueryEntity<QueryType>[];
  /** Raw loaded pages, in cursor order. */
  pages: PagedQueryChunk<PagedQueryEntity<QueryType>>[];
  /** Combined paging window across loaded pages. */
  pagingInfo: ReturnType<QueryType['getPagingInfo']>;
  error: ReturnType<QueryType['getError']>;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  reset: () => void;
  addToStart: (itemOrItems: PagedQueryEntity<QueryType> | PagedQueryEntity<QueryType>[]) => void;
  addToEnd: (itemOrItems: PagedQueryEntity<QueryType> | PagedQueryEntity<QueryType>[]) => void;
  update: (updator: (draft: PagedQueryChunk<PagedQueryEntity<QueryType>>[]) => void | PagedQueryChunk<PagedQueryEntity<QueryType>>[]) => void;
};

/**
 * Cursor-paginated infinite-list hook. `PagedQuery` owns the page buffer; this
 * hook flattens it for feed-style consumers.
 */
export const useInfinitePagedQuery = <QueryType extends AnyPagedQuery>(options: {
  pagedQuery: QueryType;
  params: PagedQueryParamsFor<QueryType>;
  isEnabled?: boolean;
}): UseInfinitePagedQueryResult<QueryType> => {
  const { pagedQuery, params, isEnabled = true } = options;

  useEffect(() => {
    if (!isEnabled) return;
    pagedQuery.register(params);
  }, [pagedQuery, params, isEnabled]);

  const state = useSyncExternalStore(
    (callback) =>
      pagedQuery.subscribe(params, () => {
        callback();
      }),
    () => pagedQuery.getStateOrNull(params),
    () => null,
  );

  const loadNextPage = useCallback(() => {
    if (!isEnabled) return;
    if (state?.isLoading) return;
    void pagedQuery.loadNextPage(params);
  }, [isEnabled, pagedQuery, params, state?.isLoading]);

  const loadPreviousPage = useCallback(() => {
    if (!isEnabled) return;
    if (state?.isLoading) return;
    void pagedQuery.loadPreviousPage(params);
  }, [isEnabled, pagedQuery, params, state?.isLoading]);

  const reset = useCallback(() => {
    if (!isEnabled) return;
    void pagedQuery.reset(params);
  }, [isEnabled, pagedQuery, params]);

  const addToStart = useCallback(
    (itemOrItems: PagedQueryEntity<QueryType> | PagedQueryEntity<QueryType>[]) => {
      pagedQuery.addToStart(params, itemOrItems);
    },
    [pagedQuery, params],
  );

  const addToEnd = useCallback(
    (itemOrItems: PagedQueryEntity<QueryType> | PagedQueryEntity<QueryType>[]) => {
      pagedQuery.addToEnd(params, itemOrItems);
    },
    [pagedQuery, params],
  );

  const update = useCallback(
    (updator: (draft: PagedQueryChunk<PagedQueryEntity<QueryType>>[]) => void | PagedQueryChunk<PagedQueryEntity<QueryType>>[]) => {
      pagedQuery.update(params, updator);
    },
    [pagedQuery, params],
  );

  const pages = (state?.pages ?? []) as PagedQueryChunk<PagedQueryEntity<QueryType>>[];
  const pagingInfo = state?.pagingInfo ?? null;
  const data = pages.flatMap((page) => page.data) as PagedQueryEntity<QueryType>[];

  return useMemo(
    () => ({
      data,
      pages,
      pagingInfo,
      error: state?.error ?? null,
      isLoading: !!state?.isLoading,
      isError: !!state?.error,
      hasNextPage: pagingInfo?.hasNextPage ?? false,
      hasPreviousPage: pagingInfo?.hasPreviousPage ?? false,
      loadNextPage,
      loadPreviousPage,
      reset,
      addToStart,
      addToEnd,
      update,
    }),
    [addToEnd, addToStart, data, loadNextPage, loadPreviousPage, pages, pagingInfo, reset, state, update],
  ) as UseInfinitePagedQueryResult<QueryType>;
};
