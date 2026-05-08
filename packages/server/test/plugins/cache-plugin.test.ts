import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { loggingPlugin } from '../../src/plugins/built-in/logging/index.js';
import { cachePlugin, memoryCacheStore } from '../../src/plugins/built-in/cache/index.js';
import { rateLimitPlugin } from '../../src/plugins/built-in/rate-limit/index.js';
import { requestIdPlugin } from '../../src/plugins/built-in/request-id/index.js';
import { definePlugin } from '../../src/plugins/index.js';
import { hashStable, stableStringify } from '../../src/plugins/built-in/cache/keys.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { Server } from '../../src/server/server.js';

type Profile = SchemaEntity<{ name: string; userId: string }>;

type Post = SchemaEntity<{ profileId: string; title: string }>;

type CacheSchemaEntities = {
  profile: Profile;
  post: Post;
};

type CacheSchemaContext = {
  userId: string;
  profiles: Profile[];
  posts: Post[];
  counts: {
    profileById: number;
    profiles: number;
    posts: number;
    nameLength: number;
  };
  postBatches: string[][];
  nameLengthBatches: string[][];
};

const createCacheSchema = () => {
  const schema = new Schema<CacheSchemaContext, CacheSchemaEntities>();

  schema.model('profile', {
    schema: z.object({
      id: z.string(),
      name: z.string(),
      userId: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      name: field(),
      userId: field(),
    }),
    externalFields: ({ externalField }) => ({
      nameLength: externalField({
        schema: z.number(),
        cache: {
          ttlMs: 60_000,
          tags: ({ entity }) => [`profile:${entity!.id}:nameLength`],
        },
        resolve: async ({ context, entities }) => {
          context.counts.nameLength += 1;

          context.nameLengthBatches.push(entities.map((entity) => entity.id));

          return entities.map((entity) => entity.name.length);
        },
      }),
    }),
    allowEach: ({ context, entity }) => entity.userId === context.userId,
    queries: ({ querySingle, queryMany }) => ({
      profileById: querySingle({
        query: z.object({ id: z.string() }),
        cache: {
          ttlMs: 60_000,
          tags: ({ query }) => [`profile:${query.id}`],
        },
        resolve: async ({ context, query }) => {
          context.counts.profileById += 1;

          const profile = context.profiles.find((item) => item.id === query.id && item.userId === context.userId);

          if (!profile) {
            throw new Error('profile not found');
          }

          return profile;
        },
      }),
      profiles: queryMany({
        query: z.object({ limit: z.number() }),
        resolve: async ({ context, query }) => {
          context.counts.profiles += 1;

          return context.profiles.filter((profile) => profile.userId === context.userId).slice(0, query.limit);
        },
      }),
    }),
    includes: ({ includeMany }) => ({
      posts: includeMany('post', {
        matchKey: 'profileId',
        cache: {
          ttlMs: 60_000,
          tags: ({ parent }) => [`profile:${parent!.id}:posts`],
        },
        resolve: async ({ context, parents }) => {
          context.counts.posts += 1;

          context.postBatches.push(parents.map((parent) => parent.id));

          const ids = new Set(parents.map((parent) => parent.id));

          return context.posts.filter((post) => ids.has(post.profileId));
        },
      }),
    }),
  });

  schema.model('post', {
    schema: z.object({
      id: z.string(),
      profileId: z.string(),
      title: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      profileId: field(),
      title: field(),
    }),
    queries: () => ({}),
  });

  schema.mutation('renameProfileByTag', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({ profile: z.any() }),
    allow: () => true,
    cache: {
      onSuccess: async ({ cache, input }) => {
        await cache.invalidateTag(`profile:${input.id}`);
      },
    },
    resolve: async ({ context, input }) => {
      const profile = context.profiles.find((item) => item.id === input.id && item.userId === context.userId)!;
      profile.name = input.name;
      return { profile };
    },
  });

  schema.mutation('renameProfileByPath', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({ profile: z.any() }),
    allow: () => true,
    cache: {
      onSuccess: async ({ cache }) => {
        await cache.invalidatePath('profileById');
      },
    },
    resolve: async ({ context, input }) => {
      const profile = context.profiles.find((item) => item.id === input.id && item.userId === context.userId)!;
      profile.name = input.name;
      return { profile };
    },
  });

  schema.mutation('renameProfileByQuery', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({ profile: z.any() }),
    allow: () => true,
    cache: {
      onSuccess: async ({ cache, input }) => {
        await cache.invalidateQuery({ path: 'profileById', query: { id: input.id } });
      },
    },
    resolve: async ({ context, input }) => {
      const profile = context.profiles.find((item) => item.id === input.id && item.userId === context.userId)!;
      profile.name = input.name;
      return { profile };
    },
  });

  schema.mutation('createPost', {
    input: z.object({ profileId: z.string(), title: z.string() }),
    output: z.object({ post: z.any() }),
    allow: () => true,
    cache: {
      onSuccess: async ({ cache, input }) => {
        await cache.invalidateTag(`profile:${input.profileId}:posts`);
      },
    },
    resolve: async ({ context, input }) => {
      const post = { id: `post-${context.posts.length + 1}`, profileId: input.profileId, title: input.title };
      context.posts.push(post);
      return { post };
    },
  });

  schema.mutation('renameProfileExternalOnly', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({ profile: z.any() }),
    allow: () => true,
    cache: {
      onSuccess: async ({ cache, input }) => {
        await cache.invalidateExternalField({ path: 'profileById.external.nameLength', entityId: input.id });
        await cache.invalidateExternalField({ path: 'profiles.external.nameLength', entityId: input.id });
      },
    },
    resolve: async ({ context, input }) => {
      const profile = context.profiles.find((item) => item.id === input.id && item.userId === context.userId)!;
      profile.name = input.name;
      return { profile };
    },
  });

  return schema;
};

const createState = (): CacheSchemaContext => ({
  userId: 'u1',
  profiles: [
    { id: 'p1', name: 'one', userId: 'u1' },
    { id: 'p2', name: 'two', userId: 'u1' },
    { id: 'p3', name: 'three', userId: 'u1' },
    { id: 'p1', name: 'other-one', userId: 'u2' },
  ],
  posts: [
    { id: 'post-1', profileId: 'p1', title: 'one-a' },
    { id: 'post-2', profileId: 'p2', title: 'two-a' },
    { id: 'post-3', profileId: 'p2', title: 'two-b' },
  ],
  counts: {
    profileById: 0,
    profiles: 0,
    posts: 0,
    nameLength: 0,
  },
  postBatches: [],
  nameLengthBatches: [],
});

const createServer = (state: CacheSchemaContext) =>
  new Server<any>({
    schema: createCacheSchema(),
    generateSchema: { enabled: false },
    createContext: async (options) => ({ ...state, userId: (options.request as { userId?: string }).userId ?? state.userId }),
    plugins: [
      cachePlugin({
        store: memoryCacheStore({ maxEntries: 100 }),
        defaultTtlMs: 60_000,
        defaultScope: ({ context }) => [`user:${(context as CacheSchemaContext).userId}`],
      }),
    ],
  });

const profileByIdQuery = (id: string) =>
  ({
    profileById: {
      query: { id },
      select: { name: true },
    },
  }) as const;

const profileByIdSelectQuery = (id: string, select: Record<string, true>) =>
  ({
    profileById: {
      query: { id },
      select,
    },
  }) as any;

const profilesWithPostsQuery = (limit: number) =>
  ({
    profiles: {
      query: { limit },
      select: { name: true },
      include: {
        posts: {
          query: {},
          select: { title: true, profileId: true },
        },
      },
    },
  }) as const;

const profilesWithExternalQuery = (limit: number) =>
  ({
    profiles: {
      query: { limit },
      select: { name: true, nameLength: true },
    },
  }) as const;

describe('cachePlugin', () => {
  test('memory store lazily expires entries and invalidates by tag', async () => {
    const store = memoryCacheStore();

    await store.set('a', 'one', { ttlMs: 20, tags: ['tag:a'] });
    expect((await store.get('a'))?.value).toBe('one');

    await store.invalidateTags(['tag:a']);
    expect(await store.get('a')).toBeNull();

    await store.set('b', 'two', { ttlMs: 1 });
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(await store.get('b')).toBeNull();
  });

  test('stable hashing ignores object key order and preserves undefined distinctly', () => {
    expect(stableStringify({ b: 2, a: 1 })).toBe(stableStringify({ a: 1, b: 2 }));
    expect(hashStable({ a: undefined })).not.toBe(hashStable({}));
  });

  test('caches root query resolvers with per-user default scope', async () => {
    const state = createState();
    const server = createServer(state);

    const first = await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') });
    const second = await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') });
    const otherUser = await server.handleQuery({ request: { userId: 'u2' }, query: profileByIdQuery('p1') });

    expect((first.profileById.data as any)?.name).toBe('one');
    expect((second.profileById.data as any)?.name).toBe('one');
    expect((otherUser.profileById.data as any)?.name).toBe('other-one');
    expect(state.counts.profileById).toBe(2);
  });

  test('root query cache keys include select shape', async () => {
    const state = createState();
    const server = createServer(state);

    const nameOnly = await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdSelectQuery('p1', { name: true }) });
    const userOnly = await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdSelectQuery('p1', { userId: true }) });
    const nameAgain = await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdSelectQuery('p1', { name: true }) });

    expect((nameOnly.profileById.data as any)?.name).toBe('one');
    expect((userOnly.profileById.data as any)?.userId).toBe('u1');
    expect((nameAgain.profileById.data as any)?.name).toBe('one');
    expect(state.counts.profileById).toBe(2);
  });

  test('root query cache keys include include tree shape', async () => {
    const state = createState();
    const server = createServer(state);

    await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') });

    const withInclude = await server.handleQuery({
      request: { userId: 'u1' },
      query: {
        profileById: {
          query: { id: 'p1' },
          select: { name: true },
          include: {
            posts: {
              query: {},
              select: { title: true },
            },
          },
        },
      } as any,
    });

    expect((withInclude.profileById.data as any)?.posts).toHaveLength(1);
    expect(state.counts.profileById).toBe(2);
    expect(state.counts.posts).toBe(1);
  });

  test('caches includes per parent and resolves only missing parents on partial hits', async () => {
    const state = createState();
    const server = createServer(state);

    await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithPostsQuery(2) });
    await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithPostsQuery(3) });

    expect(state.counts.posts).toBe(2);
    expect(state.postBatches).toEqual([['p1', 'p2'], ['p3']]);
  });

  test('invalidates cached root queries by tag, path and exact query', async () => {
    const state = createState();
    const server = createServer(state);

    await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') });

    await server.handleMutation({
      request: { userId: 'u1' },
      mutation: { renameProfileByTag: { input: { id: 'p1', name: 'tagged' } } },
    });
    expect(((await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') })).profileById.data as any)?.name).toBe(
      'tagged',
    );

    await server.handleMutation({
      request: { userId: 'u1' },
      mutation: { renameProfileByPath: { input: { id: 'p1', name: 'pathed' } } },
    });
    expect(((await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') })).profileById.data as any)?.name).toBe(
      'pathed',
    );

    await server.handleMutation({
      request: { userId: 'u1' },
      mutation: { renameProfileByQuery: { input: { id: 'p1', name: 'queried' } } },
    });
    expect(((await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') })).profileById.data as any)?.name).toBe(
      'queried',
    );
  });

  test('invalidates include entries from mutation onSuccess', async () => {
    const state = createState();
    const server = createServer(state);

    const before = await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithPostsQuery(1) });

    await server.handleMutation({
      request: { userId: 'u1' },
      mutation: { createPost: { input: { profileId: 'p1', title: 'one-b' } } },
    });

    const after = await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithPostsQuery(1) });

    expect((before.profiles.data as any)?.[0]?.posts).toHaveLength(1);
    expect((after.profiles.data as any)?.[0]?.posts).toHaveLength(2);
  });

  test('caches external fields independently and resolves only missing entities', async () => {
    const state = createState();
    const server = createServer(state);

    const first = await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithExternalQuery(2) });
    const second = await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithExternalQuery(3) });

    expect((first.profiles.data as any)?.map((profile: any) => profile.nameLength)).toEqual([3, 3]);
    expect((second.profiles.data as any)?.map((profile: any) => profile.nameLength)).toEqual([3, 3, 5]);
    expect(state.counts.profiles).toBe(2);
    expect(state.counts.nameLength).toBe(2);
    expect(state.nameLengthBatches).toEqual([['p1', 'p2'], ['p3']]);
  });

  test('invalidates exact external field entries from mutation onSuccess', async () => {
    const state = createState();
    const server = createServer(state);

    const before = await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithExternalQuery(1) });

    await server.handleMutation({
      request: { userId: 'u1' },
      mutation: { renameProfileExternalOnly: { input: { id: 'p1', name: 'long-name' } } },
    });

    const after = await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithExternalQuery(1) });

    expect((before.profiles.data as any)?.[0]?.nameLength).toBe(3);
    expect((after.profiles.data as any)?.[0]?.nameLength).toBe(9);
  });

  test('coalesces concurrent root cache misses', async () => {
    const state = createState();
    const server = createServer(state);

    await Promise.all([
      server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') }),
      server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') }),
    ]);

    expect(state.counts.profileById).toBe(1);
  });

  test('still composes with existing plugins after query wrapper metadata changes', async () => {
    const state = createState();
    const consume = vi.fn(async () => ({ remainingPoints: 100, msBeforeNext: 0 }));
    const server = new Server<any>({
      schema: createCacheSchema(),
      generateSchema: { enabled: false },
      createContext: async (options) => ({ ...state, userId: (options.request as { userId?: string }).userId ?? 'u1' }),
      plugins: [
        requestIdPlugin(),
        loggingPlugin(),
        rateLimitPlugin({ getIdentity: () => 'u1', limiter: { consume } as any }),
        cachePlugin({ defaultScope: ({ context }) => [`user:${(context as CacheSchemaContext).userId}`] }),
      ],
    });

    const result = await server.handleQuery({ request: { userId: 'u1' }, query: profileByIdQuery('p1') });

    expect(result.profileById.error).toBeNull();
    expect(consume).toHaveBeenCalled();
  });

  test('external fields participate in plugin resolver wrappers', async () => {
    const state = createState();
    const events: string[] = [];
    const server = new Server<any>({
      schema: createCacheSchema(),
      generateSchema: { enabled: false },
      createContext: async (options) => ({ ...state, userId: (options.request as { userId?: string }).userId ?? 'u1' }),
      plugins: [
        definePlugin({
          name: 'external-field-observer',
          async onResolveExternalField({ node, entities, next }) {
            events.push(`${node.path}:${entities.length}:before`);
            const result = await next();
            events.push(`${node.path}:after`);
            return result;
          },
        }),
      ],
    });

    await server.handleQuery({ request: { userId: 'u1' }, query: profilesWithExternalQuery(2) });

    expect(events).toEqual(['profiles.external.nameLength:2:before', 'profiles.external.nameLength:after']);
  });
});
