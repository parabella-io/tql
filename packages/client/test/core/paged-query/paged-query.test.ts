import { describe, expect, it, vi } from 'vitest';
import { createOptimisticUpdate } from '../../../src/core/query/query-optimistic-update';
import { PagedQuery } from '../../../src/core/paged-query/paged-query';
import { createPagedQueryStore } from '../../../src/core/paged-query/paged-query-store';
import { createQueryStore } from '../../../src/core/query/query-store';

type Post = {
  id: string;
  title: string;
};

const pageOne = {
  data: [
    { id: '1', title: 'One' },
    { id: '2', title: 'Two' },
  ],
  pagingInfo: {
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: '1',
    endCursor: '2',
  },
};

const pageTwo = {
  data: [
    { id: '3', title: 'Three' },
    { id: '4', title: 'Four' },
  ],
  pagingInfo: {
    hasNextPage: false,
    hasPreviousPage: true,
    startCursor: '3',
    endCursor: '4',
  },
};

const previousPage = {
  data: [{ id: '0', title: 'Zero' }],
  pagingInfo: {
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: '0',
    endCursor: '0',
  },
};

function createPostsPagedQuery() {
  const pagedStore = createPagedQueryStore();
  const handler = vi.fn(async (query: Record<string, any>) => {
    const pagingInfo = query.posts.pagingInfo;

    if (pagingInfo.after === '2') {
      return {
        posts: {
          ...pageTwo,
          error: null,
        },
      };
    }

    if (pagingInfo.before === '1') {
      return {
        posts: {
          ...previousPage,
          error: null,
        },
      };
    }

    return {
      posts: {
        ...pageOne,
        error: null,
      },
    };
  });

  const query = new PagedQuery<any, any, any, { title: string | null }>({
    store: pagedStore,
    queryHandler: handler,
    queryName: 'posts',
    queryOptions: {
      queryKey: 'posts',
      pageSize: 2,
      query: (params, pagingInfo) => ({
        query: {
          title: params.title,
        },
        pagingInfo,
        select: {
          title: true,
        },
      }),
    },
  });

  return { query, pagedStore, handler };
}

describe('PagedQuery', () => {
  it('loads the first page and appends the next page', async () => {
    const { query, handler } = createPostsPagedQuery();
    const params = { title: null };

    await query.execute(params);
    expect(query.getData(params)).toEqual(pageOne.data);

    await query.loadNextPage(params);

    expect(query.getState(params).pages.map((page) => page.data)).toEqual([pageOne.data, pageTwo.data]);
    expect(query.getAllData(params)).toEqual([...pageOne.data, ...pageTwo.data]);
    expect(query.getState(params).pageIndex).toBe(1);
    expect(query.getPagingInfo(params)).toEqual({
      hasPreviousPage: false,
      startCursor: '1',
      hasNextPage: false,
      endCursor: '4',
    });
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('prepends previous pages and keeps cursor order', async () => {
    const { query } = createPostsPagedQuery();
    const params = { title: null };

    await query.execute(params);
    query.update(params, (pages) => {
      pages[0]!.pagingInfo.hasPreviousPage = true;
    });
    await query.loadPreviousPage(params);

    expect(query.getState(params).pages.map((page) => page.data)).toEqual([previousPage.data, pageOne.data]);
    expect(query.getState(params).pageIndex).toBe(0);
  });

  it('slides to loaded pages and fetches missing pages for goToPage', async () => {
    const { query, handler } = createPostsPagedQuery();
    const params = { title: null };

    await query.execute(params);
    await query.goToPage(params, 1);

    expect(query.getState(params).pageIndex).toBe(1);
    expect(query.getData(params)).toEqual(pageTwo.data);
    expect(handler).toHaveBeenCalledTimes(2);

    await query.goToPage(params, 0);

    expect(query.getState(params).pageIndex).toBe(0);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('adds values to the start and end of loaded paged values', async () => {
    const { query } = createPostsPagedQuery();
    const params = { title: null };
    const startPost: Post = { id: 'start', title: 'Start' };
    const endPost: Post = { id: 'end', title: 'End' };

    await query.execute(params);
    await query.loadNextPage(params);
    query.addToStart(params, startPost);
    query.addToEnd(params, endPost);

    const state = query.getState(params);
    expect(state.pages[0]!.data[0]).toEqual(startPost);
    expect(state.pages[1]!.data.at(-1)).toEqual(endPost);
    expect(state.pagingInfo).toEqual({
      hasPreviousPage: false,
      startCursor: '1',
      hasNextPage: false,
      endCursor: '4',
    });
  });

  it('resets loaded pages and fetches the first page again', async () => {
    const { query, handler } = createPostsPagedQuery();
    const params = { title: null };

    await query.execute(params);
    await query.loadNextPage(params);
    await query.reset(params);

    expect(query.getState(params).pages.map((page) => page.data)).toEqual([pageOne.data]);
    expect(query.getState(params).pageIndex).toBe(0);
    expect(handler).toHaveBeenCalledTimes(3);
  });

  it('rolls back optimistic paged updates with the shared optimistic store', async () => {
    const queryStore = createQueryStore();
    const { query, pagedStore } = createPostsPagedQuery();
    const params = { title: null };
    const optimisticPost: Post = { id: 'optimistic', title: 'Optimistic' };

    await query.execute(params);

    const optimisticUpdate = createOptimisticUpdate(queryStore, pagedStore);
    optimisticUpdate.start();
    optimisticUpdate.paged(query, params).addToEnd(optimisticPost);
    optimisticUpdate.commit();

    expect(query.getAllData(params)).toEqual([...pageOne.data, optimisticPost]);

    optimisticUpdate.rollback();

    expect(query.getAllData(params)).toEqual(pageOne.data);
  });
});
