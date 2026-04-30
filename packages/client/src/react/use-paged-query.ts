import stableStringify from 'fast-json-stable-stringify';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Query } from '../core/query/query';
import type { PagedQueryChunk, ResolvedPagingInfo } from './paged-query-utils';
import { useQuery } from './use-query';

type AnyQuery = Query<any, any, any, any>;

type QueryParamsFor<QueryType extends AnyQuery> = QueryType extends Query<any, any, any, infer Params> ? Params : never;

type PagingInfoIn = {
  take?: number;
  before?: string | null;
  after?: string | null;
};

type MergeOp = 'reset' | 'append' | 'prepend';

type PagedQueryEntity<Q extends AnyQuery> =
  Exclude<ReturnType<Q['getData']>, null> extends infer D ? (D extends (infer E)[] ? E : never) : never;

export type UsePagedQueryResult<Q extends AnyQuery> = {
  /** Rows for the **current page** only (replaced when changing pages). */
  data: PagedQueryEntity<Q>[];
  /** Paging window for the current page. */
  pagingInfo: ResolvedPagingInfo | null;
  /** Zero-based page index (0 = first page). */
  pageIndex: number;
  error: ReturnType<Q['getError']>;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  reset: () => void;
};

/**
 * Cursor-paginated `queryMany` hook with **table-style** paging: each navigation
 * replaces `data` with a single page instead of accumulating chunks.
 *
 * Use {@link useInfinitePagedQuery} for infinite lists that grow as you load more.
 *
 * `params` must not include `pagingInfo`; the hook injects it using server cursors.
 */
export const usePagedQuery = <QueryType extends AnyQuery>(options: {
  query: QueryType;
  params: Omit<QueryParamsFor<QueryType>, 'pagingInfo'>;
  pageSize: number;
  isEnabled?: boolean;
}): UsePagedQueryResult<QueryType> => {
  const { query, params, pageSize, isEnabled = true } = options;

  const paramsKey = useMemo(() => stableStringify(params), [params]);

  const pendingMergeRef = useRef<MergeOp | null>('reset');

  const [pagingRequest, setPagingRequest] = useState<PagingInfoIn>(() => ({
    take: pageSize,
  }));

  const [pageIndex, setPageIndex] = useState(0);

  const [currentChunk, setCurrentChunk] = useState<PagedQueryChunk<PagedQueryEntity<QueryType>> | null>(null);

  const chunkNavRef = useRef<PagedQueryChunk<PagedQueryEntity<QueryType>> | null>(null);

  const resetKey = `${paramsKey}:${pageSize}`;

  const [prevResetKey, setPrevResetKey] = useState(resetKey);

  const nextPaging: PagingInfoIn = resetKey !== prevResetKey ? { take: pageSize } : pagingRequest;

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setPagingRequest(nextPaging);
    setCurrentChunk(null);
    setPageIndex(0);
    chunkNavRef.current = null;
    pendingMergeRef.current = 'reset';
  }

  const mergedParams = useMemo(() => {
    const pagingInfo: PagingInfoIn = {
      ...nextPaging,
      take: nextPaging.take ?? pageSize,
    };
    return { ...params, pagingInfo } as QueryParamsFor<QueryType>;
  }, [params, nextPaging, pageSize]);

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
      setCurrentChunk(chunk);
      chunkNavRef.current = chunk;
      setPageIndex(0);
      return;
    }

    if (op === 'append') {
      pendingMergeRef.current = null;
      setCurrentChunk(chunk);
      chunkNavRef.current = chunk;
      setPageIndex((i) => i + 1);
      return;
    }

    if (op === 'prepend') {
      pendingMergeRef.current = null;
      setCurrentChunk(chunk);
      chunkNavRef.current = chunk;
      setPageIndex((i) => Math.max(0, i - 1));
      return;
    }

    setCurrentChunk(chunk);
    chunkNavRef.current = chunk;
  }, [q.data, q.pagingInfo]);

  const loadNextPage = useCallback(() => {
    if (!isEnabled) return;
    if (q.isLoading) return;
    const pi = chunkNavRef.current?.pagingInfo;
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
    const pi = chunkNavRef.current?.pagingInfo;
    if (!pi?.hasPreviousPage || pi.startCursor === null) return;
    pendingMergeRef.current = 'prepend';
    setPagingRequest({
      take: pageSize,
      before: pi.startCursor,
    });
  }, [isEnabled, q.isLoading, pageSize]);

  const reset = useCallback(() => {
    pendingMergeRef.current = 'reset';
    setCurrentChunk(null);
    chunkNavRef.current = null;
    setPageIndex(0);
    setPagingRequest({
      take: pageSize,
    });
  }, [pageSize]);

  const data = (currentChunk?.data ?? []) as PagedQueryEntity<QueryType>[];

  const pagingInfo = currentChunk?.pagingInfo ?? null;

  return useMemo(
    () =>
      ({
        data,
        pagingInfo,
        pageIndex,
        error: q.error,
        isLoading: q.isLoading,
        isError: q.isError,
        hasNextPage: pagingInfo?.hasNextPage ?? false,
        hasPreviousPage: pagingInfo?.hasPreviousPage ?? false,
        loadNextPage,
        loadPreviousPage,
        reset,
      }) as UsePagedQueryResult<QueryType>,
    [data, loadNextPage, loadPreviousPage, pageIndex, pagingInfo, q.error, q.isError, q.isLoading, reset],
  );
};
