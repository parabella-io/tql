import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Mutation } from '../../src/core/mutation/mutation';
import { createQueryStore, Query } from '../../src';
import { QueryStore } from '../../src/core/query/query-store';
import { createMutationStore, MutationStore } from '../../src/core/mutation/mutation.store';

describe('Mutation', () => {
  let queryStore: QueryStore;
  let mutationStore: MutationStore;

  beforeEach(() => {
    queryStore = createQueryStore();
    mutationStore = createMutationStore();
  });

  it('executes a mutation and stores the output', async () => {
    const mutationName = 'createPost';
    const output = {
      post: {
        id: '1',
        title: 'Test Title',
        content: 'Test Content',
        profileId: '1',
      },
    };

    const handleMutation = vi.fn().mockResolvedValue({
      [mutationName]: {
        data: output,
        error: null,
      },
    });

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      mutationStore,
      mutationHandler: handleMutation,
      mutationName,
      mutationOptions: {
        mutationKey: mutationName,
        mutation: (params) => ({
          id: params.id,
          title: params.title,
          content: params.content,
          profileId: params.profileId,
        }),
      },
    });

    const params = {
      id: '1',
      title: 'Test Title',
      content: 'Test Content',
      profileId: '1',
    };

    const response = createPostMutation.execute(params);
    const beforeState = createPostMutation.getState(params);
    expect(beforeState.isLoading).toBe(true);
    expect(beforeState.isSuccess).toBe(null);

    await expect(response).resolves.toEqual(output);

    const afterState = createPostMutation.getState(params);
    expect(afterState.isLoading).toBe(false);
    expect(afterState.isSuccess).toBe(true);
    expect(afterState.output).toEqual(output);
    expect(afterState.error).toEqual(null);
    expect(afterState.mutationName).toBe(mutationName);
    expect(afterState.mutationInput).toEqual(params);
  });

  it('runs onSuccess and updates the query store', async () => {
    const postsQueryName = 'posts';
    const posts = [
      {
        id: '1',
        title: 'Test Title',
        content: 'Test Content',
        profileId: '1',
      },
      {
        id: '2',
        title: 'Test Title 2',
        content: 'Test Content 2',
        profileId: '2',
      },
    ];

    const postsQuery = new Query<any, any, any, any>({
      store: queryStore,
      queryHandler: vi.fn().mockResolvedValue({
        [postsQueryName]: {
          data: posts,
          pagingInfo: null,
          error: null,
        },
      }),
      queryName: postsQueryName,
      queryOptions: {
        queryKey: postsQueryName,
        query: (params) => ({
          query: {
            title: params.title,
          },
          select: {
            title: true,
            content: true,
            profileId: true,
          },
        }),
      },
    });

    const postsQueryParams = {
      title: null,
    };

    await postsQuery.execute(postsQueryParams);

    const mutationName = 'createPost';
    const output = {
      post: {
        id: '3',
        title: 'Test Title 3',
        content: 'Test Content',
        profileId: '1',
      },
    };

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      mutationStore,
      mutationHandler: vi.fn().mockResolvedValue({
        [mutationName]: {
          data: output,
          error: null,
        },
      }),
      mutationName,
      mutationOptions: {
        mutationKey: mutationName,
        mutation: (params) => ({
          id: params.id,
          title: params.title,
          content: params.content,
          profileId: params.profileId,
        }),
        onSuccess: ({ store, output }) => {
          store.get(postsQuery, postsQueryParams).update((draft: any) => {
            draft?.push(output.post);
          });
        },
      },
    });

    await createPostMutation.execute(output.post);

    expect(postsQuery.getData(postsQueryParams)).toEqual([...posts, output.post]);
  });

  it('does not roll back optimistic updates or fail the mutation when onSuccess throws', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const postsQueryName = 'posts';
    const posts = [
      {
        id: '1',
        title: 'Test Title',
        content: 'Test Content',
        profileId: '1',
      },
    ];

    const postsQuery = new Query<any, any, any, any>({
      store: queryStore,
      queryHandler: vi.fn().mockResolvedValue({
        [postsQueryName]: {
          data: posts,
          pagingInfo: null,
          error: null,
        },
      }),
      queryName: postsQueryName,
      queryOptions: {
        queryKey: postsQueryName,
        query: (params) => ({
          query: {
            title: params.title,
          },
          select: {
            title: true,
            content: true,
            profileId: true,
          },
        }),
      },
    });

    const postsQueryParams = {
      title: null,
    };

    await postsQuery.execute(postsQueryParams);

    const mutationName = 'createPost';
    const optimisticPost = {
      id: 'optimistic',
      title: 'Optimistic Title',
      content: 'Optimistic Content',
      profileId: '1',
    };
    const output = {
      post: {
        id: '2',
        title: 'Persisted Title',
        content: 'Persisted Content',
        profileId: '1',
      },
    };

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      mutationStore,
      mutationHandler: vi.fn().mockResolvedValue({
        [mutationName]: {
          data: output,
          error: null,
        },
      }),
      mutationName,
      mutationOptions: {
        mutationKey: mutationName,
        mutation: (params) => ({
          id: params.id,
          title: params.title,
          content: params.content,
          profileId: params.profileId,
        }),
        onOptimisticUpdate: ({ store }) => {
          store.get(postsQuery, postsQueryParams).update((draft: any) => {
            draft?.push(optimisticPost);
          });
        },
        onSuccess: ({ store, output }) => {
          store.get(postsQuery, postsQueryParams).update((draft: any) => {
            draft?.push(output.post);
          });

          throw new Error('onSuccess failed');
        },
      },
    });

    try {
      await expect(createPostMutation.execute(output.post)).resolves.toEqual(output);

      expect(postsQuery.getData(postsQueryParams)).toEqual([...posts, optimisticPost]);

      const afterState = createPostMutation.getState(output.post);
      expect(afterState.isLoading).toBe(false);
      expect(afterState.isSuccess).toBe(true);
      expect(afterState.isError).toBe(false);
      expect(afterState.output).toEqual(output);
      expect(afterState.error).toEqual(null);

      expect(consoleErrorSpy).toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
