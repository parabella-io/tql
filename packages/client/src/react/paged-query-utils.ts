/**
 * Cursor paging helpers shared by `useInfinitePagedQuery` and `usePagedQuery`.
 * Kept separate for small, environment-agnostic unit tests.
 */

export type ResolvedPagingInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

/** One loaded page: entity rows plus the response-level paging window for that request. */
export type PagedQueryChunk<T = unknown> = {
  data: T[];
  pagingInfo: ResolvedPagingInfo;
};

export function isPagedQueryChunk(value: unknown): value is PagedQueryChunk {
  if (value === null || typeof value !== 'object') return false;
  if (!('data' in value) || !('pagingInfo' in value)) return false;
  const v = value as PagedQueryChunk;
  if (!Array.isArray(v.data)) return false;
  const pi = v.pagingInfo;
  if (pi === null || typeof pi !== 'object') return false;
  return (
    typeof pi.hasNextPage === 'boolean' &&
    typeof pi.hasPreviousPage === 'boolean' &&
    'startCursor' in pi &&
    (pi.startCursor === null || typeof pi.startCursor === 'string') &&
    'endCursor' in pi &&
    (pi.endCursor === null || typeof pi.endCursor === 'string')
  );
}

/**
 * Merge window: first page tells us if there is a previous page / start cursor;
 * last page tells us if there is a next page / end cursor.
 */
export function combinePagingInfo(pages: PagedQueryChunk[]): ResolvedPagingInfo | null {
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
