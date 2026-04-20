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

  it('should be able to execute a mutation and see correct state changes', async () => {
    const mutationName = 'createPost';

    const changes = {
      post: {
        inserts: [
          {
            id: '1',
            title: 'Test Title',
            content: 'Test Content',
            profileId: '1',
          },
        ],
      },
    };

    const handleMutation = vi.fn().mockResolvedValue({
      [mutationName]: {
        changes,
        error: null,
      },
    });

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      queryUpdateHooks: {},
      mutationStore,
      mutationHandler: handleMutation,
      mutationName: mutationName,
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

    await expect(response).resolves.toEqual(changes);

    const afterState = createPostMutation.getState(params);
    expect(afterState.isLoading).toBe(false);
    expect(afterState.isSuccess).toBe(true);
    expect(afterState.changes).toEqual(changes);
    expect(afterState.error).toEqual(null);
    expect(afterState.mutationName).toBe(mutationName);
    expect(afterState.mutationInput).toEqual({
      id: '1',
      title: 'Test Title',
      content: 'Test Content',
      profileId: '1',
    });
  });

  it('should invoke mutation hooks and update the query store', async () => {
    const queryUpdateHooks = {};

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

    const postsQueryResponse = vi.fn().mockResolvedValue({
      [postsQueryName]: {
        data: posts,
        error: null,
        metadata: {},
      },
    });

    const postsQueryParams = {
      title: null,
    };

    const postsQuery = new Query<any, any, any, any>({
      store: queryStore,
      queryHandler: postsQueryResponse,
      queryName: postsQueryName,
      queryUpdateHooks,
      queryOptions: {
        queryKey: postsQueryName,
        query: (params) => ({
          query: {
            title: params.title,
          },
          select: true,
        }),
      },
    });

    await postsQuery.execute(postsQueryParams);

    const mutationName = 'createPost';

    const changes = {
      post: {
        inserts: [
          {
            id: '3',
            title: 'Test Title 3',
            content: 'Test Content',
            profileId: '1',
          },
        ],
        updates: [
          {
            id: '1',
            title: 'Test Title (UPDATED)',
            content: 'Test Content',
            profileId: '1',
          },
        ],
        upserts: [
          {
            id: '4',
            title: 'Test Title 4',
            content: 'Test Content 4',
            profileId: '4',
          },
        ],
        deletes: [
          {
            id: '2',
          },
        ],
      },
    };

    const handleMutation = vi.fn().mockResolvedValue({
      [mutationName]: {
        changes,
        error: null,
      },
    });

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      queryUpdateHooks,
      mutationStore,
      mutationHandler: handleMutation,
      mutationName: mutationName,
      mutationOptions: {
        mutationKey: mutationName,
        mutation: (params) => ({
          id: params.id,
          title: params.title,
          content: params.content,
          profileId: params.profileId,
        }),
        onInsert: ({ store, inserted }) => {
          console.log({
            inserted,
          });

          const posts = store.get(postsQuery, postsQueryParams);

          const insertedPost = (inserted as any).post;

          if (insertedPost) {
            posts.update((draft: any) => {
              draft?.push({
                id: insertedPost.id,
                title: insertedPost.title,
                content: insertedPost.content,
                profileId: insertedPost.profileId,
              });
            });
          }
        },
        onUpdate: ({ store, updated }) => {
          const posts = store.getAll(postsQuery);

          const updatedPost = (updated as any).post;

          if (updatedPost) {
            posts.update((draft: any) => {
              const indexOf = draft?.findIndex((post) => post.id === updatedPost.id);

              if (indexOf !== undefined) {
                draft![indexOf] = {
                  id: updatedPost.id,
                  title: updatedPost.title,
                  content: updatedPost.content,
                  profileId: updatedPost.profileId,
                };
              }
            });
          }
        },
        onDelete: ({ store, deleted }) => {
          const posts = store.where(postsQuery, postsQueryParams);

          const deletedPost = (deleted as any).post;

          if (deletedPost) {
            posts.update((draft: any) => {
              const indexOf = draft?.findIndex((post) => post.id === deletedPost.id);

              if (indexOf !== undefined) {
                draft!.splice(indexOf, 1);
              }
            });
          }
        },
        onUpsert: ({ store, upserted }) => {
          const posts = store.getAll(postsQuery);

          const upsertedPost = (upserted as any).post;

          if (upsertedPost) {
            posts.update((draft: any) => {
              const indexOf = draft?.findIndex((post) => post.id === upsertedPost.id);

              if (indexOf === -1) {
                draft?.push(upsertedPost);
                return;
              }

              if (indexOf !== undefined) {
                draft![indexOf] = upsertedPost;
              }
            });
          }
        },
      },
    });

    await createPostMutation.execute({
      id: '3',
      title: 'Test Title 3',
      content: 'Test Content',
      profileId: '1',
    });

    const updatedPosts = postsQuery.getData(postsQueryParams);

    expect(updatedPosts).toEqual([
      {
        id: '1',
        title: 'Test Title (UPDATED)',
        content: 'Test Content',
        profileId: '1',
      },
      {
        id: '3',
        title: 'Test Title 3',
        content: 'Test Content',
        profileId: '1',
      },
      {
        id: '4',
        title: 'Test Title 4',
        content: 'Test Content 4',
        profileId: '4',
      },
    ]);
  });

  it('should invoke query update hooks and update the query store', async () => {
    const queryUpdateHooks = {};

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

    const postsQueryResponse = vi.fn().mockResolvedValue({
      [postsQueryName]: {
        data: posts,
        error: null,
        metadata: {},
      },
    });

    const postsQueryParams = {
      title: null,
    };

    const postsQuery = new Query<any, any, any, any>({
      store: queryStore,
      queryHandler: postsQueryResponse,
      queryName: postsQueryName,
      queryUpdateHooks,
      queryOptions: {
        queryKey: postsQueryName,
        query: (params) => ({
          query: {
            title: params.title,
          },
          select: true,
        }),
      },
    });

    postsQuery.updateOnChange('post', {
      onInsert: ({ draft, change }) => {
        let _draft = draft as any[];

        _draft?.push(change);
      },
      onUpdate: ({ draft, change }) => {
        let _draft = draft as any[];

        const indexOf = _draft?.findIndex((post) => post.id === change.id);

        if (indexOf !== undefined) {
          _draft![indexOf] = change;
        }
      },
      onDelete: ({ draft, change }) => {
        let _draft = draft as any[];

        const indexOf = _draft?.findIndex((post) => post.id === change.id);

        if (indexOf !== undefined) {
          _draft!.splice(indexOf, 1);
        }
      },
    });

    const response: any = await postsQuery.execute(postsQueryParams);

    expect(response.posts.data).toEqual(posts);

    expect(postsQuery.getState(postsQueryParams).data).toEqual(posts);

    const mutationName = 'createPost';

    const changes = {
      post: {
        inserts: [
          {
            id: '3',
            title: 'Test Title 3',
            content: 'Test Content',
            profileId: '1',
          },
        ],
        updates: [
          {
            id: '1',
            title: 'Test Title (UPDATED)',
            content: 'Test Content',
            profileId: '1',
          },
        ],
        deletes: [
          {
            id: '2',
          },
        ],
      },
    };

    const handleMutation = vi.fn().mockResolvedValue({
      [mutationName]: {
        changes,
        error: null,
      },
    });

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      queryUpdateHooks,
      mutationStore,
      mutationHandler: handleMutation,
      mutationName: mutationName,
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

    await createPostMutation.execute({
      id: '3',
      title: 'Test Title 3',
      content: 'Test Content',
      profileId: '1',
    });

    const updatedPosts = postsQuery.getData(postsQueryParams);

    expect(updatedPosts).toEqual([
      {
        id: '1',
        title: 'Test Title (UPDATED)',
        content: 'Test Content',
        profileId: '1',
      },
      {
        id: '3',
        title: 'Test Title 3',
        content: 'Test Content',
        profileId: '1',
      },
    ]);
  });

  it('should support optional query hooks and onUpsert', async () => {
    const queryUpdateHooks = {};

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

    const postsQueryResponse = vi.fn().mockResolvedValue({
      [postsQueryName]: {
        data: posts,
        error: null,
        metadata: {},
      },
    });

    const postsQueryParams = {
      title: null,
    };

    const postsQuery = new Query<any, any, any, any>({
      store: queryStore,
      queryHandler: postsQueryResponse,
      queryName: postsQueryName,
      queryUpdateHooks,
      queryOptions: {
        queryKey: postsQueryName,
        query: (params) => ({
          query: {
            title: params.title,
          },
          select: true,
        }),
      },
    });

    postsQuery.updateOnChange('post', {
      onUpsert: ({ draft, change }) => {
        const postsDraft = draft as any[];
        const indexOf = postsDraft.findIndex((post) => post.id === change.id);

        if (indexOf === -1) {
          postsDraft.push(change);
          return;
        }

        postsDraft[indexOf] = change;
      },
    });

    await postsQuery.execute(postsQueryParams);

    const mutationName = 'createPost';

    const changes = {
      post: {
        upserts: [
          {
            id: '1',
            title: 'Test Title (UPSERTED)',
            content: 'Test Content',
            profileId: '1',
          },
          {
            id: '3',
            title: 'Test Title 3',
            content: 'Test Content 3',
            profileId: '3',
          },
        ],
      },
    };

    const handleMutation = vi.fn().mockResolvedValue({
      [mutationName]: {
        changes,
        error: null,
      },
    });

    const createPostMutation = new Mutation<any, any, any, any>({
      queryStore,
      queryUpdateHooks,
      mutationStore,
      mutationHandler: handleMutation,
      mutationName: mutationName,
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

    await createPostMutation.execute({
      id: '3',
      title: 'Test Title 3',
      content: 'Test Content 3',
      profileId: '3',
    });

    expect(postsQuery.getData(postsQueryParams)).toEqual([
      {
        id: '1',
        title: 'Test Title (UPSERTED)',
        content: 'Test Content',
        profileId: '1',
      },
      {
        id: '2',
        title: 'Test Title 2',
        content: 'Test Content 2',
        profileId: '2',
      },
      {
        id: '3',
        title: 'Test Title 3',
        content: 'Test Content 3',
        profileId: '3',
      },
    ]);
  });
});
