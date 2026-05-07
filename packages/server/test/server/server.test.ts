import { afterEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import { create } from '../test-schema/database.js';
import { schema, type ClientSchema } from '../test-schema/index.js';
import { Server } from '../../src/server/server.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import type { HttpAdapter, HttpHandler, HttpHandlerHooks } from '../../src/server/adapters/http/http-adapter.js';
import { effectsPlugin } from '../../src/plugins/built-in/effects/index.js';
import '../test-schema/models.js';
import '../test-schema/mutations.js';

type TestRequest = {
  body: any;
};

type StoredHandler = HttpHandler<TestRequest>;

type FakeTransport = {
  adapter: HttpAdapter<TestRequest>;
  invoke(
    path: string,
    request: TestRequest,
  ): Promise<{
    response: unknown;
    flushResponse(): Promise<void>;
  }>;
};

function createFakeTransport(): FakeTransport {
  const routes = new Map<string, StoredHandler>();

  const adapter: HttpAdapter<TestRequest> = {
    post(path, handler) {
      routes.set(path, handler);
    },
    getBody(request) {
      return request.body;
    },
  };

  return {
    adapter,
    async invoke(path, request) {
      const handler = routes.get(path);

      if (!handler) throw new Error(`no handler for ${path}`);

      const afterResponseCallbacks: Array<() => void | Promise<void>> = [];

      const hooks: HttpHandlerHooks = {
        afterResponse(cb) {
          afterResponseCallbacks.push(cb);
        },
      };

      const response = await handler(request, hooks);

      return {
        response,
        async flushResponse() {
          for (const cb of afterResponseCallbacks) {
            try {
              await cb();
            } catch {
              // Post-response errors must never bubble into the transport.
            }
          }
        },
      };
    },
  };
}

describe('Server', () => {
  let database: Awaited<ReturnType<typeof create>>['db'] | undefined;

  afterEach(() => {
    database?.close();
    database = undefined;
  });

  test('creates context from the HTTP request and forwards it to query handlers', async () => {
    const data = await create();

    database = data.db;

    const transport = createFakeTransport();

    const createContext = vi.fn(async ({ request }: { request: unknown }) => ({
      userId: 'request-user',
      isAuthenticated: true,
      database: data.db,
    }));

    const server = new Server<ClientSchema>({
      schema,
      createContext,
      generateSchema: { enabled: false },
    });

    server.attachHttp(transport.adapter);

    const request: TestRequest = {
      body: {
        profileById: {
          query: { id: data.profileEntities[0].id },
          select: { name: true },
        },
      },
    };

    const { response } = await transport.invoke('/query', request);

    expect(createContext).toHaveBeenCalledWith({ request });

    expect(response).toMatchObject({
      profileById: {
        data: {
          id: data.profileEntities[0].id,
          name: data.profileEntities[0].name,
        },
        error: null,
      },
    });
  });

  test('creates context from the HTTP request and forwards it to mutation handlers', async () => {
    const data = await create();

    database = data.db;

    const transport = createFakeTransport();

    const createContext = vi.fn(async ({ request }: { request: unknown }) => ({
      userId: 'request-derived-id',
      isAuthenticated: true,
      database: data.db,
    }));

    const server = new Server<ClientSchema>({
      schema,
      createContext,
      generateSchema: { enabled: false },
    });

    server.attachHttp(transport.adapter);

    const request: TestRequest = {
      body: {
        createProfile: {
          input: {
            name: 'Created from request context',
            hobbies: [{ level: 1, name: 'testing' }],
            address: {
              street: '123 Test St',
              city: 'Spec City',
              state: 'TS',
              zip: '12345',
            },
          },
        },
      },
    };

    const { response } = await transport.invoke('/mutation', request);

    expect(createContext).toHaveBeenCalledWith({ request });

    expect(response).toMatchObject({
      createProfile: {
        data: {
          profile: {
            id: 'request-derived-id',
            name: 'Created from request context',
          },
        },
        error: null,
      },
    });
  });
});

type EffectThing = SchemaEntity<{ name: string }>;

type EffectSchemaEntities = {
  effectThing: EffectThing;
};

type EffectSchemaContext = {
  userId: string;
};

type EffectSchema = {
  SchemaEntities: EffectSchemaEntities;
  MutationInputMap: {
    createEffectThing: { input: { id: string; name: string } };
  };
  MutationResponseMap: {
    createEffectThing: {
      data: {
        effectThing: { id: string; name: string };
      };
      error: null;
    };
  };
  MutationOutputMap: {
    createEffectThing: {
      effectThing: { id: string; name: string };
    };
  };
  QueryInputMap: {};
  QueryResponseMap: {};
  QueryRegistry: Record<string, any>;
};

describe('Server - effects lifecycle', () => {
  test('enqueues mutation effects only after afterResponse hook fires', async () => {
    const effectSchema = new Schema<EffectSchemaContext, EffectSchemaEntities>();
    const resolveEffects = vi.fn(async () => {});

    effectSchema.mutation('createEffectThing', {
      input: z.object({ id: z.string(), name: z.string() }),
      output: z.object({
        effectThing: z.object({ id: z.string(), name: z.string() }),
      }),
      allow: () => true,
      resolve: async ({ input }) => ({
        effectThing: { id: input.id, name: input.name },
      }),
      resolveEffects,
    });

    const transport = createFakeTransport();
    const effects = effectsPlugin();

    const server = new Server<EffectSchema>({
      schema: effectSchema as any,
      createContext: async () => ({ userId: 'u1' }),
      generateSchema: { enabled: false },
      plugins: [effects],
    });

    server.attachHttp(transport.adapter);

    const { response, flushResponse } = await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(response).toMatchObject({
      createEffectThing: {
        data: { effectThing: { id: 't1', name: 'first' } },
        error: null,
      },
    });

    expect(resolveEffects).not.toHaveBeenCalled();

    await flushResponse();

    await effects.drain();

    expect(resolveEffects).toHaveBeenCalledTimes(1);

    expect(resolveEffects).toHaveBeenCalledWith({
      context: { userId: 'u1' },
      input: { id: 't1', name: 'first' },
      output: { effectThing: { id: 't1', name: 'first' } },
    });
  });

  test('does not enqueue mutation effects until the response is flushed', async () => {
    const effectSchema = new Schema<EffectSchemaContext, EffectSchemaEntities>();
    const resolveEffects = vi.fn(async () => {});

    effectSchema.mutation('createEffectThing', {
      input: z.object({ id: z.string(), name: z.string() }),
      output: z.object({
        effectThing: z.object({ id: z.string(), name: z.string() }),
      }),
      allow: () => true,
      resolve: async ({ input }) => ({
        effectThing: { id: input.id, name: input.name },
      }),
      resolveEffects,
    });

    const transport = createFakeTransport();
    const effects = effectsPlugin();

    const server = new Server<EffectSchema>({
      schema: effectSchema as any,
      createContext: async () => ({ userId: 'u1' }),
      generateSchema: { enabled: false },
      plugins: [effects],
    });

    server.attachHttp(transport.adapter);

    await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    await effects.drain();

    expect(resolveEffects).not.toHaveBeenCalled();
  });

  test('does not enqueue effects when mutation fails', async () => {
    const effectSchema = new Schema<EffectSchemaContext, EffectSchemaEntities>();

    const resolveEffects = vi.fn(async () => {});

    effectSchema.mutation('createEffectThing', {
      input: z.object({ id: z.string(), name: z.string() }),
      output: z.object({
        effectThing: z.object({ id: z.string(), name: z.string() }),
      }),
      allow: () => false,
      resolve: async ({ input }) => ({
        effectThing: { id: input.id, name: input.name },
      }),
      resolveEffects,
    });

    const transport = createFakeTransport();
    const effects = effectsPlugin();

    const server = new Server<EffectSchema>({
      schema: effectSchema as any,
      createContext: async () => ({ userId: 'u1' }),
      generateSchema: { enabled: false },
      plugins: [effects],
    });

    server.attachHttp(transport.adapter);

    const { flushResponse } = await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    await flushResponse();

    await effects.drain();

    expect(resolveEffects).not.toHaveBeenCalled();
  });

  test('effect failures are isolated from the HTTP response and routed to onError', async () => {
    const effectSchema = new Schema<EffectSchemaContext, EffectSchemaEntities>();

    const boom = new Error('effect failed');

    effectSchema.mutation('createEffectThing', {
      input: z.object({ id: z.string(), name: z.string() }),
      output: z.object({
        effectThing: z.object({ id: z.string(), name: z.string() }),
      }),
      allow: () => true,
      resolve: async ({ input }) => ({
        effectThing: { id: input.id, name: input.name },
      }),
      resolveEffects: async () => {
        throw boom;
      },
    });

    const transport = createFakeTransport();

    const onError = vi.fn();
    const effects = effectsPlugin({ onError });

    const server = new Server<EffectSchema>({
      schema: effectSchema as any,
      createContext: async () => ({ userId: 'u1' }),
      generateSchema: { enabled: false },
      plugins: [effects],
    });

    server.attachHttp(transport.adapter);

    const { response, flushResponse } = await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(response).toMatchObject({
      createEffectThing: { error: null },
    });

    await flushResponse();

    await effects.drain();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]![0]).toBe(boom);
    expect(onError.mock.calls[0]![1]).toEqual({ mutationName: 'createEffectThing' });
  });
});
