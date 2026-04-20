import { afterEach, describe, expect, test, vi } from 'vitest';
import { create } from '../test-schema/database.js';
import { schema } from '../test-schema/schema.js';
import type { ClientSchema } from '../test-schema/generated/schema.js';
import { Server } from '../../src/server/server.js';
import type { HttpAdapter } from '../../src/server/adapters/http/http-adapter.js';

import '../test-schema/models.js';
import '../test-schema/mutations.js';

type TestRequest = {
  body: any;
};

describe('Server', () => {
  let database: Awaited<ReturnType<typeof create>>['db'] | undefined;

  afterEach(() => {
    database?.close();
    database = undefined;
  });

  test('creates context from the HTTP request and forwards it to query handlers', async () => {
    const data = await create();

    database = data.db;

    const routes = new Map<string, (request: TestRequest) => Promise<unknown> | unknown>();

    const adapter: HttpAdapter<TestRequest> = {
      post(path, handler) {
        routes.set(path, handler);
      },
      getBody(request) {
        return request.body;
      },
    };

    const createContext = vi.fn(async ({ request }: { request: TestRequest }) => ({
      userId: 'request-user',
      isAuthenticated: true,
      database: data.db,
    }));

    const server: Server<ClientSchema, TestRequest> = new Server({
      schema,
      createContext,
      generateSchema: {
        enabled: false,
      },
    });

    server.attachHttp(adapter);

    const request: TestRequest = {
      body: {
        profileById: {
          query: { id: data.profileEntities[0].id },
          select: { name: true },
        },
      },
    };

    const response = await routes.get('/query')?.(request);

    expect(createContext).toHaveBeenCalledWith({ request });

    expect(response).toMatchObject({
      profileById: {
        data: {
          id: data.profileEntities[0].id,
          name: data.profileEntities[0].name,
          __model: 'profile',
        },
        error: null,
      },
    });
  });

  test('creates context from the HTTP request and forwards it to mutation handlers', async () => {
    const data = await create();
    database = data.db;

    const routes = new Map<string, (request: TestRequest) => Promise<unknown> | unknown>();

    const adapter: HttpAdapter<TestRequest> = {
      post(path, handler) {
        routes.set(path, handler);
      },
      getBody(request) {
        return request.body;
      },
    };

    const createContext = vi.fn(async ({ request }: { request: TestRequest }) => ({
      userId: 'request-derived-id',
      isAuthenticated: true,
      database: data.db,
    }));

    const server: Server<ClientSchema, TestRequest> = new Server({
      schema,
      createContext,
      generateSchema: {
        enabled: false,
      },
    });

    server.attachHttp(adapter);

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

    const response = await routes.get('/mutation')?.(request);

    expect(createContext).toHaveBeenCalledWith({ request });

    expect(response).toMatchObject({
      createProfile: {
        changes: {
          profile: {
            inserts: [
              {
                id: 'request-derived-id',
                name: 'Created from request context',
              },
            ],
          },
        },
        error: null,
      },
    });
  });
});
