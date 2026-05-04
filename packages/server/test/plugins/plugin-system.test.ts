import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { TQLServerError, TQLServerErrorType } from '../../src/errors.js';
import { definePlugin, requestIdPlugin, securityPlugin, type ServerPlugin } from '../../src/plugins/index.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { Server } from '../../src/server/server.js';

type Thing = SchemaEntity<{ name: string }>;

type PluginSchemaEntities = {
  thing: Thing;
};

type PluginSchemaContext = {
  value: string;
};

type PluginClientSchema = {
  SchemaEntities: PluginSchemaEntities;
  QueryInputMap: {
    thing: { query: {}; select: { name?: true }; include?: {} };
  };
  QueryResponseMap: Record<string, any>;
  QueryRegistry: Record<string, any>;
  MutationInputMap: {};
  MutationResponseMap: {};
  MutationOutputMap: {};
};

const createSchema = (resolveSpy?: () => void) => {
  const schema = new Schema<PluginSchemaContext, PluginSchemaEntities>();

  schema.model('thing', {
    schema: z.object({
      id: z.string(),
      name: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      name: field(),
    }),
    queries: ({ querySingle }) => ({
      thing: querySingle({
        query: z.object({}),
        resolve: async ({ context }) => {
          resolveSpy?.();

          return {
            id: 'thing-1',
            name: context.requestId ?? context.value,
          };
        },
      }),
    }),
  });

  return schema;
};

const thingQuery = {
  thing: {
    query: {},
    select: { name: true },
  },
} as const;

describe('plugin system', () => {
  test('runs setup once, merges plugin context, and composes resolver wrappers outside-in', async () => {
    const events: string[] = [];

    const pluginA = definePlugin({
      name: 'a',
      setup: () => {
        events.push('a:setup');
      },
      createPluginContext: () => {
        events.push('a:context');
        return {};
      },
      beforeQuery: () => {
        events.push('a:before');
      },
      onResolveQueryNode: async ({ next }) => {
        events.push('a:wrap:before');
        const result = await next();
        events.push('a:wrap:after');
        return result;
      },
      afterQuery: () => {
        events.push('a:after');
      },
    } satisfies ServerPlugin);

    const pluginB = definePlugin({
      name: 'b',
      setup: () => {
        events.push('b:setup');
      },
      createPluginContext: () => {
        events.push('b:context');
        return {};
      },
      beforeQuery: () => {
        events.push('b:before');
      },
      onResolveQueryNode: async ({ next }) => {
        events.push('b:wrap:before');
        const result = await next();
        events.push('b:wrap:after');
        return result;
      },
      afterQuery: () => {
        events.push('b:after');
      },
    } satisfies ServerPlugin);

    const server = new Server<PluginClientSchema>({
      schema: createSchema(() => events.push('resolver')),
      generateSchema: { enabled: false },
      createContext: async () => ({ value: 'base' }),
      plugins: [pluginA, pluginB],
    });

    const result = await server.handleQuery({ request: {}, query: thingQuery });

    expect(result.thing.error).toBeNull();
    expect(events).toEqual([
      'a:setup',
      'b:setup',
      'a:context',
      'b:context',
      'a:before',
      'b:before',
      'a:wrap:before',
      'b:wrap:before',
      'resolver',
      'b:wrap:after',
      'a:wrap:after',
      'a:after',
      'b:after',
    ]);
  });

  test('before hooks short-circuit resolvers and onError can transform errors', async () => {
    const resolver = vi.fn();

    const plugin = definePlugin({
      name: 'reject-and-redact',
      beforeQuery: () => {
        throw new TQLServerError(TQLServerErrorType.SecurityRejectedError, { secret: 'hide-me' });
      },
      onError: () => new TQLServerError(TQLServerErrorType.SecurityRejectedError, { message: 'redacted' }),
    });

    const server = new Server<PluginClientSchema>({
      schema: createSchema(resolver),
      generateSchema: { enabled: false },
      createContext: async () => ({ value: 'base' }),
      plugins: [plugin],
    });

    const result = await server.handleQuery({ request: {}, query: thingQuery });

    expect(resolver).not.toHaveBeenCalled();
    expect(result.thing.error).toEqual({
      type: TQLServerErrorType.SecurityRejectedError,
      details: { message: 'redacted' },
    });
  });

  test('requestIdPlugin exposes request id to schema context', async () => {
    const server = new Server<PluginClientSchema>({
      schema: createSchema(),
      generateSchema: { enabled: false },
      createContext: async () => ({ value: 'base' }),
      plugins: [requestIdPlugin()],
    });

    const result = await server.handleQuery({
      request: {
        headers: {
          'x-request-id': 'req-123',
        },
      },
      query: thingQuery,
    });

    expect(result.thing.data).toMatchObject({ name: 'req-123' });
  });

  test('securityPlugin preserves allowed-shape enforcement', async () => {
    const resolver = vi.fn();
    const server = new Server<PluginClientSchema>({
      schema: createSchema(resolver),
      generateSchema: { enabled: false },
      createContext: async () => ({ value: 'base' }),
      plugins: [securityPlugin({ allowedShapes: {} })],
    });

    const result = await server.handleQuery({ request: {}, query: thingQuery });

    expect(resolver).not.toHaveBeenCalled();
    expect(result.thing.error?.type).toBe(TQLServerErrorType.SecurityShapeNotAllowedError);
  });
});

