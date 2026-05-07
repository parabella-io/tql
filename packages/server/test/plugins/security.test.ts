import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { TQLServerError, TQLServerErrorType } from '../../src/errors.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { Server } from '../../src/server/server.js';
import {
  allowedShapesPolicy,
  batchPolicy,
  bodyLimitPolicy,
  breadthPolicy,
  complexityPolicy,
  depthPolicy,
  securityPlugin,
  takePolicy,
  timeoutPolicy,
} from '../../src/plugins/built-in/security/index.js';
import { buildQueryPlan } from '../../src/request-plan/index.js';
import { schema as testSchema } from '../test-schema/schema.js';
import '../test-schema/models.js';

type Thing = SchemaEntity<{ name: string }>;

type SecuritySchemaEntities = {
  thing: Thing;
};

type SecuritySchemaContext = {
  things: Thing[];
};

type SecurityClientSchema = {
  SchemaEntities: SecuritySchemaEntities;
  QueryInputMap: {
    thingById: { query: { id: string }; select: { id?: true; name?: true }; include?: {} };
    things: { query: { limit: number }; select: { id?: true; name?: true }; include?: {} };
  };
  QueryResponseMap: Record<string, any>;
  QueryRegistry: Record<string, any>;
  MutationInputMap: {};
  MutationResponseMap: {};
  MutationOutputMap: {};
};

const createSecuritySchema = (resolve?: (args: { signal?: AbortSignal }) => Promise<Thing> | Thing) => {
  const schema = new Schema<SecuritySchemaContext, SecuritySchemaEntities>();

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
        security: { complexity: 2, timeoutMs: 5 },
        resolve: async ({ signal }) => {
          return resolve ? resolve({ signal }) : { id: 't1', name: 'one' };
        },
      }),
      things: queryMany({
        query: z.object({ limit: z.number() }),
        security: {
          complexity: ({ query }) => query.limit * 2,
          timeoutMs: 100,
        },
        resolve: async ({ context, query }) => context.things.slice(0, query.limit),
      }),
    }),
  });

  return schema;
};

describe('security plan and policies', () => {
  test('builds query plans with include depth and validated inputs', () => {
    const plan = buildQueryPlan({
      schema: testSchema,
      query: {
        profiles: {
          query: { cursor: null, limit: 10, order: 'asc' },
          select: { name: true },
          include: {
            posts: {
              query: { limit: 5, order: 'asc' },
              select: { title: true },
              include: {
                profile: {
                  query: { comment: null },
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    expect(plan.totalNodes).toBe(3);
    expect(plan.maxDepth).toBe(2);
    expect(plan.nodes[0]?.includes[0]?.path).toBe('profiles.include.posts');
  });

  test('allowed shapes accept subsets and reject terminal nesting', () => {
    const allowedPlan = buildQueryPlan({
      schema: testSchema,
      query: {
        profiles: {
          query: { cursor: null, limit: 10, order: 'asc' },
          select: { name: true },
          include: {
            posts: {
              query: { limit: 5, order: 'asc' },
              select: { title: true },
            },
          },
        },
      },
    });

    expect(() =>
      allowedShapesPolicy({
        shapes: {
          profiles: {
            select: true,
            include: { posts: true },
          },
        },
      }).beforeQuery?.({} as any, allowedPlan),
    ).not.toThrow();

    const deniedPlan = buildQueryPlan({
      schema: testSchema,
      query: {
        profiles: {
          query: { cursor: null, limit: 10, order: 'asc' },
          select: { name: true },
          include: {
            posts: {
              query: { limit: 5, order: 'asc' },
              select: { title: true },
              include: {
                profile: {
                  query: { comment: null },
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    expect(() =>
      allowedShapesPolicy({
        shapes: {
          profiles: {
            select: true,
            include: { posts: true },
          },
        },
      }).beforeQuery?.({} as any, deniedPlan),
    ).toThrowError(TQLServerError);
  });

  test('shape policies reject oversized plans before execution', () => {
    const plan = buildQueryPlan({
      schema: testSchema,
      query: {
        profiles: {
          query: { cursor: null, limit: 10, order: 'asc' },
          select: { name: true },
          include: {
            posts: {
              query: { limit: 5, order: 'asc' },
              select: { title: true },
            },
          },
        },
      },
    });

    expect(() => depthPolicy({ maxDepth: 0 }).beforeQuery?.({} as any, plan)).toThrowError(TQLServerError);
    expect(() => breadthPolicy({ maxTotalIncludes: 0 }).beforeQuery?.({} as any, plan)).toThrowError(TQLServerError);
    expect(() => batchPolicy({ maxQueriesPerRequest: 0 }).beforeQuery?.({} as any, plan)).toThrowError(TQLServerError);
    expect(() => bodyLimitPolicy({ maxBytes: 1 }).beforeQuery?.({ body: { too: 'large' } } as any, plan)).toThrowError(TQLServerError);
  });

  test('take policy enforces paginated query take ceilings', () => {
    const plan = buildQueryPlan({
      schema: testSchema,
      query: {
        posts: {
          query: { title: null },
          select: { title: true },
          pagingInfo: { take: 5, before: null, after: null },
        },
      },
    });

    expect(() => takePolicy({ defaultMax: 1 }).beforeQuery?.({} as any, plan)).toThrowError(TQLServerError);
  });

  test('complexity policy honors resolver dynamic overrides', () => {
    const schema = createSecuritySchema();
    const plan = buildQueryPlan({
      schema,
      query: {
        things: {
          query: { limit: 3 },
          select: { name: true },
        },
      },
    });

    expect(() =>
      complexityPolicy({
        defaults: { single: 1, many: 1, selectKey: 0 },
        budget: 5,
      }).beforeQuery?.({ principal: null, costs: {} } as any, plan),
    ).toThrowError(TQLServerError);
  });

  test('query plans preserve resolver extensions for plugin-owned metadata', () => {
    const schema = createSecuritySchema();
    const plan = buildQueryPlan({
      schema,
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
      },
    });

    expect((plan.nodes[0]?.extensions as { security?: { timeoutMs?: number } }).security?.timeoutMs).toBe(5);
  });

  test('timeout policy applies resolver overrides and server returns security errors', async () => {
    const schema = createSecuritySchema(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ id: 't1', name: 'slow' }), 30);
        }),
    );

    const server = new Server<SecurityClientSchema>({
      schema,
      generateSchema: { enabled: false },
      createContext: async () => ({ things: [{ id: 't1', name: 'one' }] }),
      plugins: [securityPlugin({ policies: [timeoutPolicy({ perResolverTimeoutMs: 100 })] })],
    });

    const result = await server.handleQuery({
      request: {},
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
      },
    });

    expect(result.thingById.error?.type).toBe(TQLServerErrorType.SecurityTimeoutError);
  });

  test('allowed shapes short-circuit before a resolver is called', async () => {
    const resolve = vi.fn(async () => ({ id: 't1', name: 'one' }));
    const schema = createSecuritySchema(resolve);
    const server = new Server<SecurityClientSchema>({
      schema,
      generateSchema: { enabled: false },
      createContext: async () => ({ things: [{ id: 't1', name: 'one' }] }),
      plugins: [securityPlugin({ allowedShapes: {} })],
    });

    const result = await server.handleQuery({
      request: {},
      query: {
        thingById: {
          query: { id: 't1' },
          select: { name: true },
        },
      },
    });

    expect(resolve).not.toHaveBeenCalled();
    expect(result.thingById.error?.type).toBe(TQLServerErrorType.SecurityShapeNotAllowedError);
  });
});
