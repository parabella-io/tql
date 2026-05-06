import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { PagedQuery } from '../core/paged-query/paged-query';
import type { PagedQueryChunk } from '../core/paged-query/paged-query-store';

type AnyPagedQuery = PagedQuery<any, any, any, any>;

type PagedQueryParamsFor<QueryType extends AnyPagedQuery> = QueryType extends PagedQuery<any, any, any, infer Params> ? Params : never;

type PagedQueryEntity<QueryType extends AnyPagedQuery> =
  Exclude<ReturnType<QueryType['getAllData']>, null> extends (infer Entity)[] ? Entity : never;

export type UsePagedQueryResult<QueryType extends AnyPagedQuery> = {
  /** Rows for the active page only. */
  data: PagedQueryEntity<QueryType>[];
  /** Raw loaded pages, in cursor order. */
  pages: PagedQueryChunk<PagedQueryEntity<QueryType>>[];
  /** Combined paging window across loaded pages. */
  pagingInfo: ReturnType<QueryType['getPagingInfo']>;
  /** Zero-based page index in the loaded page buffer. */
  pageIndex: number;
  error: ReturnType<QueryType['getError']>;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  goToPage: (pageIndex: number) => void;
  reset: () => void;
  addToStart: (itemOrItems: PagedQueryEntity<QueryType> | PagedQueryEntity<QueryType>[]) => void;
  addToEnd: (itemOrItems: PagedQueryEntity<QueryType> | PagedQueryEntity<QueryType>[]) => void;
  update: (
    updator: (draft: PagedQueryChunk<PagedQueryEntity<QueryType>>[]) => void | PagedQueryChunk<PagedQueryEntity<QueryType>>[],
  ) => void;
};

/**
 * Cursor-paginated table-style hook. Paging state and cursor fetch logic live
 * in `PagedQuery`; this hook only subscribes and exposes the active page.
 */
export const usePagedQuery = <QueryType extends AnyPagedQuery>(options: {
  pagedQuery: QueryType;
  params: PagedQueryParamsFor<QueryType>;
  isEnabled?: boolean;
}): UsePagedQueryResult<QueryType> => {
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
    const pages = state?.pages ?? [];
    const pageIndex = state?.pageIndex ?? 0;
    if (pageIndex < pages.length - 1) {
      pagedQuery.setActivePage(params, pageIndex + 1);
    } else {
      void pagedQuery.loadNextPage(params);
    }
  }, [isEnabled, pagedQuery, params, state?.isLoading, state?.pages, state?.pageIndex]);

  const loadPreviousPage = useCallback(() => {
    if (!isEnabled) return;
    if (state?.isLoading) return;
    const pageIndex = state?.pageIndex ?? 0;
    if (pageIndex > 0) {
      pagedQuery.setActivePage(params, pageIndex - 1);
    }
  }, [isEnabled, pagedQuery, params, state?.isLoading, state?.pageIndex]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (!isEnabled) return;
      void pagedQuery.goToPage(params, pageIndex);
    },
    [isEnabled, pagedQuery, params],
  );

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
  const pageIndex = state?.pageIndex ?? 0;
  const pagingInfo = state?.pagingInfo ?? null;
  const data = (pages[pageIndex]?.data ?? []) as PagedQueryEntity<QueryType>[];

  return useMemo(
    () => ({
      data,
      pages,
      pagingInfo,
      pageIndex,
      error: state?.error ?? null,
      isLoading: !!state?.isLoading,
      isError: !!state?.error,
      hasNextPage: pageIndex < pages.length - 1 || (pagingInfo?.hasNextPage ?? false),
      hasPreviousPage: pageIndex > 0,
      loadNextPage,
      loadPreviousPage,
      goToPage,
      reset,
      addToStart,
      addToEnd,
      update,
    }),
    [addToEnd, addToStart, data, goToPage, loadNextPage, loadPreviousPage, pageIndex, pages, pagingInfo, reset, state, update],
  ) as UsePagedQueryResult<QueryType>;
};
