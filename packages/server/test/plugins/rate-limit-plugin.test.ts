import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { TQLServerErrorType } from '../../src/errors.js';
import { rateLimitPlugin } from '../../src/plugins/built-in/rate-limit/index.js';
import { buildMutationPlan, buildQueryPlan } from '../../src/request-plan/index.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';

type Thing = SchemaEntity<{ name: string }>;

type NestedParent = SchemaEntity<{ name: string }>;
type NestedChild = SchemaEntity<{ title: string; parentId: string }>;

type RateLimitSchemaEntities = {
  thing: Thing;
};

type RateLimitSchemaContext = {
  things: Thing[];
};

const createRateLimitSchema = () => {
  const schema = new Schema<RateLimitSchemaContext, RateLimitSchemaEntities>();

  schema.model('thing', {
    schema: z.object({
      id: z.string(),
      name: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      name: field(),
    }),
    queries: ({ querySingle, queryMany }) => ({
      thingById: querySingle({
        query: z.object({ id: z.string() }),
        rateLimit: { cost: 2 },
        resolve: async () => ({ id: 't1', name: 'one' }),
      }),
      things: queryMany({
        query: z.object({ limit: z.number() }),
        rateLimit: { cost: 5 },
        resolve: async ({ context, query }) => context.things.slice(0, query.limit),
      }),
    }),
  });

  schema.mutation('createThing', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({
      thing: z.object({ id: z.string(), name: z.string() }),
    }),
    allow: () => true,
    rateLimit: { cost: 10 },
    resolve: async ({ input }) => ({ thing: input }),
  });

  return schema;
};

const createNestedIncludeRateLimitSchema = () => {
  const schema = new Schema<
    Record<string, never>,
    {
      nestParent: NestedParent;
      nestChild: NestedChild;
    }
  >();

  schema.model('nestChild', {
    schema: z.object({
      id: z.string(),
      title: z.string(),
      parentId: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      title: field(),
      parentId: field(),
    }),
    queries: () => ({}),
  });

  schema.model('nestParent', {
    schema: z.object({
      id: z.string(),
      name: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      name: field(),
    }),
    queries: ({ queryMany }) => ({
      nestParents: queryMany({
        query: z.object({ limit: z.number() }),
        rateLimit: { cost: 2 },
        resolve: async () => [],
      }),
    }),
    includes: ({ includeMany }) => ({
      nestChildren: includeMany('nestChild', {
        matchKey: 'parentId',
        query: z.object({ limit: z.number() }),
        rateLimit: { cost: 3 },
        resolve: async () => [],
      }),
    }),
  });

  return schema;
};

describe('rateLimitPlugin', () => {
  test('consumes resolver-level query and mutation costs per identity', async () => {
    const schema = createRateLimitSchema();

    const queryPlan = buildQueryPlan({
      schema,
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
        things: {
          query: { limit: 2 },
          select: { name: true },
        },
      },
    });

    const mutationPlan = buildMutationPlan({
      schema,
      mutation: {
        createThing: {
          input: { id: 't1', name: 'one' },
        },
      },
    });

    const consume = vi.fn(async () => ({ remainingPoints: 100, msBeforeNext: 0 }));

    const plugin = rateLimitPlugin({
      getIdentity: (_request, context) => (context as { userId: string }).userId,
      keyPrefix: 'tql',
      limiter: { consume } as any,
    });

    const ctx = { request: {}, schemaContext: { userId: 'u1' } } as any;

    await plugin.beforeQuery?.({ ctx, plan: queryPlan });
    await plugin.beforeMutation?.({ ctx, plan: mutationPlan });

    expect(consume).toHaveBeenNthCalledWith(1, 'tql:u1', 7);
    expect(consume).toHaveBeenNthCalledWith(2, 'tql:u1', 10);
  });

  test('recursively includes selected include costs', async () => {
    const schema = createNestedIncludeRateLimitSchema();

    const plan = buildQueryPlan({
      schema,
      query: {
        nestParents: {
          query: { limit: 10 },
          select: { name: true },
          include: {
            nestChildren: {
              query: { limit: 5 },
              select: { title: true },
            },
          },
        },
      },
    });

    const consume = vi.fn(async () => ({
      remainingPoints: 100,
      msBeforeNext: 0,
    }));

    const plugin = rateLimitPlugin({
      getIdentity: () => 'u1',
      limiter: { consume } as any,
    });

    await plugin.beforeQuery?.({ ctx: { request: {}, schemaContext: {} } as any, plan });

    expect(consume).toHaveBeenCalledWith('u1', 5);
  });

  test('uses default cost for unconfigured operations', async () => {
    const schema = createRateLimitSchema();

    const plan = buildQueryPlan({
      schema,
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
      },
    });

    const consume = vi.fn(async () => ({ remainingPoints: 100, msBeforeNext: 0 }));

    const plugin = rateLimitPlugin({
      getIdentity: () => 'u1',
      limiter: { consume } as any,
    });

    plan.nodes[0]!.extensions = {};

    await plugin.beforeQuery?.({ ctx: { request: {}, schemaContext: {} } as any, plan });

    expect(consume).toHaveBeenCalledWith('u1', 1);
  });

  test('ignores complexity static cost', async () => {
    const schema = createRateLimitSchema();

    const plan = buildQueryPlan({
      schema,
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
      },
    });

    const consume = vi.fn(async () => ({ remainingPoints: 100, msBeforeNext: 0 }));

    const plugin = rateLimitPlugin({
      getIdentity: () => 'u1',
      limiter: { consume } as any,
    });

    await plugin.beforeQuery?.({ ctx: { request: {}, schemaContext: {}, plugin: { costs: { staticCost: 999 } } } as any, plan });

    expect(consume).toHaveBeenCalledWith('u1', 2);
  });

  test('maps limiter rejections to security errors', async () => {
    const schema = createRateLimitSchema();

    const plan = buildQueryPlan({
      schema,
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
      },
    });

    const plugin = rateLimitPlugin({
      getIdentity: () => 'u1',
      limiter: {
        consume: vi.fn(async () => Promise.reject({ remainingPoints: 0, msBeforeNext: 123 })),
      } as any,
    });

    await expect(plugin.beforeQuery?.({ ctx: { request: {}, schemaContext: {} } as any, plan })).rejects.toMatchObject({
      message: TQLServerErrorType.SecurityRateLimitedError,
      details: {
        key: 'u1',
        remaining: 0,
        retryAfterMs: 123,
      },
    });
  });
});
