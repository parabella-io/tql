import stableStringify from 'fast-json-stable-stringify';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Query } from '../core/query/query';
import { combinePagingInfo, type PagedQueryChunk, type ResolvedPagingInfo } from './paged-query-utils';
import { useQuery } from './use-query';

type AnyQuery = Query<any, any, any, any>;

type QueryParamsFor<QueryType extends AnyQuery> = QueryType extends Query<any, any, any, infer Params> ? Params : never;

type PagingInfoIn = {
  take?: number;
  before?: string | null;
  after?: string | null;
};

type MergeOp = 'reset' | 'append' | 'prepend';

type PageEntry<T = unknown> = {
  requestKey: string;
  chunk: PagedQueryChunk<T>;
};

type PagedQueryEntity<Q extends AnyQuery> =
  Exclude<ReturnType<Q['getData']>, null> extends infer D ? (D extends (infer E)[] ? E : never) : never;

export type UseInfinitePagedQueryResult<Q extends AnyQuery> = {
  /** All entities from loaded pages, in order (earliest page first). */
  data: PagedQueryEntity<Q>[];
  /** Raw per-page `{ data, pagingInfo }` chunks. */
  pages: PagedQueryChunk<PagedQueryEntity<Q>>[];
  /** Combined paging window across loaded pages, or `null` before the first page arrives. */
  pagingInfo: ResolvedPagingInfo | null;
  error: ReturnType<Q['getError']>;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  reset: () => void;
};

function pagingRequestKey(paging: PagingInfoIn, pageSizeFallback: number): string {
  return stableStringify({
    take: paging.take ?? pageSizeFallback,
    before: paging.before ?? null,
    after: paging.after ?? null,
  });
}

/**
 * React hook for cursor-paginated `queryMany` where the transport returns
 * `data: Entity[]` and `pagingInfo` alongside `error`. Loads the first page
 * automatically (via `useQuery`), then **accumulates** additional pages when
 * `loadNextPage` / `loadPreviousPage` run (infinite / feed-style scrolling).
 *
 * `params` must not include `pagingInfo`; the hook injects it using server cursors.
 *
 * For **table** UX (one page at a time, replace on next/prev), use {@link usePagedQuery}.
 */
export const useInfinitePagedQuery = <QueryType extends AnyQuery>(options: {
  query: QueryType;
  params: Omit<QueryParamsFor<QueryType>, 'pagingInfo'>;
  pageSize: number;
  isEnabled?: boolean;
}): UseInfinitePagedQueryResult<QueryType> => {
  const { query, params, pageSize, isEnabled = true } = options;

  const paramsKey = useMemo(() => stableStringify(params), [params]);

  const pendingMergeRef = useRef<MergeOp | null>('reset');

  const [pagingRequest, setPagingRequest] = useState<PagingInfoIn>(() => ({
    take: pageSize,
  }));

  const [pages, setPages] = useState<PageEntry<PagedQueryEntity<QueryType>>[]>([]);

  const resetKey = `${paramsKey}:${pageSize}`;

  const [prevResetKey, setPrevResetKey] = useState(resetKey);

  const nextPaging: PagingInfoIn = resetKey !== prevResetKey ? { take: pageSize } : pagingRequest;

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setPagingRequest(nextPaging);
    setPages([]);
    pendingMergeRef.current = 'reset';
  }

  const mergedParams = useMemo(() => {
    const pagingInfo: PagingInfoIn = {
      ...nextPaging,
      take: nextPaging.take ?? pageSize,
    };
    return { ...params, pagingInfo } as QueryParamsFor<QueryType>;
  }, [params, nextPaging, pageSize]);

  const currentRequestKey = useMemo(() => pagingRequestKey(nextPaging, pageSize), [nextPaging, pageSize]);

  const q = useQuery({ query, params: mergedParams, isEnabled });

  useEffect(() => {
    if (q.pagingInfo == null) return;

    const chunk: PagedQueryChunk<PagedQueryEntity<QueryType>> = {
      data: (q.data ?? []) as PagedQueryEntity<QueryType>[],
      pagingInfo: q.pagingInfo,
    };

    const op = pendingMergeRef.current;

    if (op === 'reset') {
      pendingMergeRef.current = null;
      setPages([{ requestKey: currentRequestKey, chunk }]);
      return;
    }

    if (op === 'append') {
      pendingMergeRef.current = null;
      setPages((prev) => {
        const idx = prev.findIndex((e) => e.requestKey === currentRequestKey);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { requestKey: currentRequestKey, chunk };
          return next;
        }
        return [...prev, { requestKey: currentRequestKey, chunk }];
      });
      return;
    }

    if (op === 'prepend') {
      pendingMergeRef.current = null;
      setPages((prev) => {
        const idx = prev.findIndex((e) => e.requestKey === currentRequestKey);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { requestKey: currentRequestKey, chunk };
          return next;
        }
        return [{ requestKey: currentRequestKey, chunk }, ...prev];
      });
      return;
    }

    setPages((prev) => {
      const idx = prev.findIndex((e) => e.requestKey === currentRequestKey);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { requestKey: currentRequestKey, chunk };
        return next;
      }
      if (prev.length === 0) {
        return [{ requestKey: currentRequestKey, chunk }];
      }
      return prev;
    });
  }, [q.data, q.pagingInfo, currentRequestKey]);

  const pageChunks = useMemo(() => pages.map((p) => p.chunk), [pages]);

  const combinedPaging = useMemo(() => combinePagingInfo(pageChunks), [pageChunks]);

  const flatData = useMemo(() => pageChunks.flatMap((p) => p.data) as PagedQueryEntity<QueryType>[], [pageChunks]);

  const pagesRef = useRef(pageChunks);

  pagesRef.current = pageChunks;

  const loadNextPage = useCallback(() => {
    if (!isEnabled) return;
    if (q.isLoading) return;
    const pi = combinePagingInfo(pagesRef.current);
    if (!pi?.hasNextPage || pi.endCursor === null) return;
    pendingMergeRef.current = 'append';
    setPagingRequest({
      take: pageSize,
      after: pi.endCursor,
    });
  }, [isEnabled, q.isLoading, pageSize]);

  const loadPreviousPage = useCallback(() => {
    if (!isEnabled) return;
    if (q.isLoading) return;
    const pi = combinePagingInfo(pagesRef.current);
    if (!pi?.hasPreviousPage || pi.startCursor === null) return;
    pendingMergeRef.current = 'prepend';
    setPagingRequest({
      take: pageSize,
      before: pi.startCursor,
    });
  }, [isEnabled, q.isLoading, pageSize]);

  const reset = useCallback(() => {
    pendingMergeRef.current = 'reset';
    setPages([]);
    setPagingRequest({
      take: pageSize,
    });
  }, [pageSize]);

  return useMemo(
    () =>
      ({
        data: flatData,
        pages: pageChunks as PagedQueryChunk<PagedQueryEntity<QueryType>>[],
        pagingInfo: combinedPaging,
        error: q.error,
        isLoading: q.isLoading,
        isError: q.isError,
        hasNextPage: combinedPaging?.hasNextPage ?? false,
        hasPreviousPage: combinedPaging?.hasPreviousPage ?? false,
        loadNextPage,
        loadPreviousPage,
        reset,
      }) as UseInfinitePagedQueryResult<QueryType>,
    [combinedPaging, flatData, loadNextPage, loadPreviousPage, pageChunks, q.error, q.isError, q.isLoading, reset],
  );
};
