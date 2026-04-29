import { describe, expect, it, vi } from 'vitest';
import type { ClientSchema } from '@tql/server/test-schema';
import { Query } from '../../src/core/query/query';
import { QueryDataFor } from '../../src/core/query/query.types';
import { createQueryStore, QueryStore } from '../../src/core/query/query-store';

type Schema = ClientSchema;

const profileSelect = {
  name: true,
  hobbies: true,
  address: true,
} as const;

const postSelect = {
  title: true,
  content: true,
  profileId: true,
} as const;

describe('Query', () => {
  const handleQuery = vi.fn(async (query: Record<string, any>) =>
    Object.fromEntries(
      Object.keys(query).map((queryName) => [
        queryName,
        {
          // Truthy placeholder so `execute` paths do not reject;
          // individual tests override state via `updateState` where needed.
          data: {},
          error: null,
        },
      ]),
    ),
  );

  let store: QueryStore = createQueryStore();

  it('should be able to register profileById query and be typesafe', async () => {
    const queryKey = 'profileById';

    type ProfileByIdQueryParams = {
      id: string;
    };

    type ProfileByIdQueryInput = {
      query: { id: string };
      select: typeof profileSelect;
    };

    type ProfileByIdData = QueryDataFor<Schema, 'profileById', ProfileByIdQueryInput>;

    const params: ProfileByIdQueryParams = {
      id: '1',
    };

    const query = new Query<Schema, 'profileById', ProfileByIdQueryInput, ProfileByIdQueryParams>({
      store: store,
      queryHandler: handleQuery,
      queryName: queryKey,
      queryUpdateHooks: {},
      queryOptions: {
        queryKey,
        query: (params) => ({
          query: { id: params.id },
          select: profileSelect,
        }),
      },
    });

    query.register(params);

    const data = {
      id: params.id,
      name: 'John Doe',
      hobbies: [],
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
      __model: 'profile',
    } as unknown as ProfileByIdData;

    query.updateState(params, (state) => {
      state.data = data;
      return state;
    });

    const updatedData = query.getData(params);
    expect(updatedData!.id).toEqual(data!.id);
    expect(updatedData!.name).toEqual(data!.name);
    expect(updatedData!.hobbies).toEqual(data!.hobbies);
    expect(updatedData!.address).toEqual(data!.address);
  });

  it('should be able to register posts query and be typesafe', async () => {
    const queryKey = 'posts';

    type PostsQueryParams = {
      title: string | null;
    };

    type PostsQueryInput = {
      query: { title: string | null; cursor: { id: string } | null; limit: number; order: 'asc' | 'desc' };
      select: typeof postSelect;
    };

    type PostsData = QueryDataFor<Schema, 'posts', PostsQueryInput>;

    const params: PostsQueryParams = {
      title: 'test',
    };

    const query = new Query<Schema, 'posts', PostsQueryInput, PostsQueryParams>({
      store: store,
      queryHandler: handleQuery,
      queryName: queryKey,
      queryUpdateHooks: {},
      queryOptions: {
        queryKey,
        query: (params) => ({
          query: {
            title: params.title,
            cursor: null,
            limit: 10,
            order: 'asc',
          },
          select: postSelect,
        }),
      },
    });

    query.register(params);

    const data = [
      {
        id: '1',
        title: 'Post Title',
        content: 'Post Content',
        profileId: '1',
      },
      {
        id: '2',
        title: 'Post Title 2',
        content: 'Post Content 2',
        profileId: '2',
      },
    ] as PostsData;

    query.updateState(params, (state) => {
      state.data = data;
      return state;
    });

    const updatedData = query.getData(params);

    for (const post of updatedData!) {
      const expectedPost = data!.find((p) => p.id === post.id);
      expect(post.id).toEqual(expectedPost!.id);
      expect(post.title).toEqual(expectedPost!.title);
      expect(post.content).toEqual(expectedPost!.content);
      expect(post.profileId).toEqual(expectedPost!.profileId);
    }
  });

  it('should be able to register post query and be typesafe', async () => {
    const queryKey = 'post';

    type PostQueryParams = {
      id: string;
    };

    type PostQueryInput = {
      query: { id: string };
      select: typeof postSelect;
    };

    type PostData = QueryDataFor<Schema, 'post', PostQueryInput>;

    const params: PostQueryParams = {
      id: '1',
    };

    const query = new Query<Schema, 'post', PostQueryInput, PostQueryParams>({
      store: store,
      queryHandler: handleQuery,
      queryName: queryKey,
      queryUpdateHooks: {},
      queryOptions: {
        queryKey,
        query: (params) => ({
          query: { id: params.id },
          select: postSelect,
        }),
      },
    });

    const data = {
      id: '1',
      title: 'Post Title',
      content: 'Post Content',
      profileId: '1',
      __model: 'post',
    } as unknown as PostData;

    query.register(params);

    query.updateState(params, (state) => {
      state.data = data;
      return state;
    });

    const updatedData = query.getData(params);
    expect(updatedData!.id).toEqual(data!.id);
    expect(updatedData!.title).toEqual(data!.title);
    expect(updatedData!.content).toEqual(data!.content);
    expect(updatedData!.profileId).toEqual(data!.profileId);
  });

  it('should be able to register profileNullable query and be typesafe', async () => {
    const queryKey = 'profileNullable';

    type ProfileNullableQueryParams = {};

    type ProfileNullableQueryInput = {
      query: {};
      select: typeof profileSelect;
    };

    type ProfileNullableData = QueryDataFor<Schema, 'profileNullable', ProfileNullableQueryInput>;

    const params: ProfileNullableQueryParams = {};

    const query = new Query<Schema, 'profileNullable', ProfileNullableQueryInput, ProfileNullableQueryParams>({
      store: store,
      queryHandler: handleQuery,
      queryName: queryKey,
      queryUpdateHooks: {},
      queryOptions: {
        queryKey,
        query: () => ({
          query: {},
          select: profileSelect,
        }),
      },
    });

    query.register(params);

    const data = null as ProfileNullableData;

    query.updateState(params, (state) => {
      state.data = data;
      return state;
    });

    const updatedData = query.getData(params);

    expect(updatedData).toBeNull();
  });

  it('should de-duplicate in flight execute calls for the same params', async () => {
    const queryKey = 'profileById';

    type ProfileByIdQueryParams = {
      id: string;
    };

    type ProfileByIdQueryInput = {
      query: { id: string };
      select: typeof profileSelect;
    };

    const params: ProfileByIdQueryParams = {
      id: '1',
    };

    const response = {
      profileById: {
        data: {
          id: '1',
          name: 'John Doe',
          hobbies: [],
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
          __model: 'profile',
        },
        error: null,
      },
    };

    let resolveQuery!: (value: typeof response) => void;

    const handleQuery = vi.fn(
      () =>
        new Promise<typeof response>((resolve) => {
          resolveQuery = resolve;
        }),
    );

    const query = new Query<Schema, 'profileById', ProfileByIdQueryInput, ProfileByIdQueryParams>({
      store,
      queryHandler: handleQuery,
      queryName: queryKey,
      queryUpdateHooks: {},
      queryOptions: {
        queryKey,
        query: (nextParams) => ({
          query: { id: nextParams.id },
          select: profileSelect,
        }),
      },
    });

    const firstExecution = query.execute(params);
    const secondExecution = query.execute(params);

    expect(handleQuery).toHaveBeenCalledTimes(1);

    resolveQuery(response);

    await expect(firstExecution).resolves.toEqual(response);
    await expect(secondExecution).resolves.toEqual(response);
    expect(query.getData(params)).toEqual(response.profileById.data);
  });

  it('should not re-execute an already registered query when registering again', async () => {
    const queryKey = 'profileById';
    const localStore = createQueryStore();

    type ProfileByIdQueryParams = {
      id: string;
    };

    type ProfileByIdQueryInput = {
      query: { id: string };
      select: typeof profileSelect;
    };

    const params: ProfileByIdQueryParams = {
      id: '1',
    };

    const response = {
      profileById: {
        data: {
          id: params.id,
          name: 'John Doe',
          hobbies: [],
          address: null,
          __model: 'profile',
        },
        error: null,
      },
    };

    const handleQuery = vi.fn(async () => response);

    const query = new Query<Schema, 'profileById', ProfileByIdQueryInput, ProfileByIdQueryParams>({
      store: localStore,
      queryHandler: handleQuery,
      queryName: queryKey,
      queryUpdateHooks: {},
      queryOptions: {
        queryKey,
        query: (nextParams) => ({
          query: { id: nextParams.id },
          select: profileSelect,
        }),
      },
    });

    query.register(params);
    await vi.waitFor(() => expect(query.getData(params)).toEqual(response.profileById.data));

    query.register(params);
    query.register({ ...params });

    expect(handleQuery).toHaveBeenCalledTimes(1);
  });
});
