import { describe, expect, it } from 'vitest';

import { combinePagingInfo, isPagedQueryChunk, type PagedQueryChunk } from '../../src/react/paged-query-utils';

describe('paged-query-utils', () => {
  describe('isPagedQueryChunk', () => {
    it('returns true for valid paginated page payloads', () => {
      const v: PagedQueryChunk = {
        data: [{ id: '1' }],
        pagingInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'a',
          endCursor: 'b',
        },
      };
      expect(isPagedQueryChunk(v)).toBe(true);
    });

    it('returns false for non-objects and malformed pagingInfo', () => {
      expect(isPagedQueryChunk(null)).toBe(false);
      expect(isPagedQueryChunk({ data: [], pagingInfo: null })).toBe(false);
      expect(isPagedQueryChunk({ data: 'x', pagingInfo: {} })).toBe(false);
    });
  });

  describe('combinePagingInfo', () => {
    it('returns null for an empty list', () => {
      expect(combinePagingInfo([])).toBeNull();
    });

    it('merges first-page previous + last-page next metadata', () => {
      const p1: PagedQueryChunk = {
        data: [{ id: '1' }],
        pagingInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 's1',
          endCursor: 'e1',
        },
      };
      const p2: PagedQueryChunk = {
        data: [{ id: '2' }],
        pagingInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: 's2',
          endCursor: 'e2',
        },
      };

      expect(combinePagingInfo([p1, p2])).toEqual({
        hasPreviousPage: false,
        startCursor: 's1',
        hasNextPage: false,
        endCursor: 'e2',
      });
    });
  });
});
