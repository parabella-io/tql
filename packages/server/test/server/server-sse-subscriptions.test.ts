import { afterEach, describe, expect, test } from 'vitest';
import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { Server } from '../../src/server/server.js';
import type { HttpAdapter, HttpHandler, HttpHandlerHooks, SseHandler, SseStream } from '../../src/server/adapters/http/http-adapter.js';

type Ticket = SchemaEntity<{ title: string; workspaceId: string }>;

type Entities = {
  ticket: Ticket;
};

type Context = {
  userId: string;
};

type Connection = {
  workspaceIds: string[];
};

type FakeRequest = {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  user: { id: string; workspaceIds: string[] };
};

type OpenedSseStream = {
  frames: string[];
  onCloseListeners: Array<() => void>;
  closed: boolean;
  stream: SseStream;
  close(): void;
};

type SseOpenOptions = {
  name: string;
  args: unknown;
};

type FakeHttpTransport = {
  adapter: HttpAdapter<FakeRequest>;
  invokePost(path: string, request: FakeRequest): Promise<{ response: unknown; flushResponse(): Promise<void> }>;
  openSse(path: string, request: FakeRequest, options: SseOpenOptions): Promise<OpenedSseStream>;
  /**
   * Directly invoke a registered SSE handler with a fully-controlled
   * request (e.g. to simulate a malformed query string). Returns the
   * opened stream harness after yielding once so any synchronous
   * handler work lands in `frames`.
   */
  invokeSse(path: string, request: FakeRequest): Promise<OpenedSseStream>;
};

const createFakeHttpTransport = (): FakeHttpTransport => {
  const postRoutes = new Map<string, HttpHandler<FakeRequest>>();
  const sseRoutes = new Map<string, SseHandler<FakeRequest>>();

  const adapter: HttpAdapter<FakeRequest> = {
    post(path, handler) {
      postRoutes.set(path, handler);
    },
    sse(path, handler) {
      sseRoutes.set(path, handler);
    },
    getBody(request) {
      return request.body;
    },
    getQuery(request) {
      return request.query ?? {};
    },
  };

  return {
    adapter,
    async invokePost(path, request) {
      const handler = postRoutes.get(path);
      if (!handler) throw new Error(`no POST handler for ${path}`);

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
              // best-effort for tests
            }
          }
        },
      };
    },
    async openSse(path, request, options) {
      const withQuery: FakeRequest = {
        ...request,
        query: {
          ...(request.query ?? {}),
          name: options.name,
          args: JSON.stringify(options.args ?? {}),
        },
      };
      return this.invokeSse(path, withQuery);
    },
    async invokeSse(path, request) {
      const handler = sseRoutes.get(path);
      if (!handler) throw new Error(`no SSE handler for ${path}`);

      const opened: OpenedSseStream = {
        frames: [],
        onCloseListeners: [],
        closed: false,
        stream: undefined as unknown as SseStream,
        close() {
          if (opened.closed) return;
          opened.closed = true;
          for (const listener of opened.onCloseListeners) listener();
        },
      };

      opened.stream = {
        write(data) {
          if (opened.closed) return;
          opened.frames.push(data);
        },
        close() {
          opened.close();
        },
        onClose(listener) {
          opened.onCloseListeners.push(listener);
        },
      };

      await handler(request, opened.stream);
      await new Promise((resolve) => setImmediate(resolve));

      return opened;
    },
  };
};

const parseDataFrames = (frames: string[]): any[] => {
  return frames.filter((frame) => frame.startsWith('data: ')).map((frame) => JSON.parse(frame.slice('data: '.length).replace(/\n\n$/, '')));
};

const firstOfType = (frames: string[], type: string): any | undefined => {
  return parseDataFrames(frames).find((message) => message.type === type);
};

const buildSchema = () => {
  const schema = new Schema<Context, Entities, Connection>();

  schema.subscription('ticketSubscription', {
    args: z.object({ ticketId: z.string() }),
    subscribeTo: { ticket: true },
    keyFromSubscribe: ({ args }) => args.ticketId,
    keyFromChange: ({ change }) => {
      if (change.entity !== 'ticket') return null;
      return change.row.id;
    },
    filter: ({ connection, change }) => {
      if (change.entity !== 'ticket') return false;
      if (change.operation !== 'insert' && change.operation !== 'update') return false;
      return connection.workspaceIds.includes(change.row.workspaceId as string);
    },
  });

  schema.mutation('createTicket', {
    input: z.object({ id: z.string(), title: z.string(), workspaceId: z.string() }),
    changed: { ticket: { inserts: true } },
    allow: () => true,
    resolve: async ({ input }) => ({
      ticket: {
        inserts: [{ id: input.id, title: input.title, workspaceId: input.workspaceId }],
      },
    }),
    resolveEffects: async ({ changes, emit }) => {
      emit({ ticket: changes.ticket });
    },
  });

  return schema;
};

describe('Server.attachHttp — SSE subscriptions', () => {
  let server: Server<any, Connection> | undefined;

  afterEach(() => {
    server?.dispose();
    server = undefined;
  });

  const newServer = () => {
    const schema = buildSchema();
    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      subscriptions: { sseKeepAliveMs: 0 },
      createContext: async ({ request }) => {
        const r = request as FakeRequest;
        return { userId: r.user.id };
      },
      createConnection: ({ request }) => {
        const r = request as FakeRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });
    return server;
  };

  test('GET /events?name&args registers exactly one subscription and emits subscription:ready', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    const stream = await transport.openSse(
      '/events',
      { user: { id: 'u1', workspaceIds: ['w1'] } },
      { name: 'ticketSubscription', args: { ticketId: 't1' } },
    );

    const ready = firstOfType(stream.frames, 'subscription:ready');
    expect(ready).toBeTruthy();
    expect(typeof ready.subscriptionId).toBe('string');
    expect(ready.subscriptionId.length).toBeGreaterThan(0);

    expect(srv.subscriptionResolver.getRegistry().size()).toBe(1);
  });

  test('a mutation delivers subscription:batch on the stream that subscribed', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    const stream = await transport.openSse(
      '/events',
      { user: { id: 'u1', workspaceIds: ['w1'] } },
      { name: 'ticketSubscription', args: { ticketId: 't1' } },
    );

    const ready = firstOfType(stream.frames, 'subscription:ready');
    expect(ready).toBeTruthy();

    const beforeCount = stream.frames.length;

    const mutation = await transport.invokePost('/mutation', {
      user: { id: 'u1', workspaceIds: ['w1'] },
      body: { createTicket: { input: { id: 't1', title: 'hello', workspaceId: 'w1' } } },
    });

    await mutation.flushResponse();
    await srv.drainEffects();
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    const newFrames = stream.frames.slice(beforeCount);
    const update = firstOfType(newFrames, 'subscription:batch');
    expect(update).toBeTruthy();
    expect(update.rows.ticket.inserts.t1).toMatchObject({ id: 't1', title: 'hello', workspaceId: 'w1' });
    expect(update.matches).toHaveLength(1);
    expect(update.matches[0].name).toBe('ticketSubscription');
    expect(update.matches[0].id).toBe(ready.subscriptionId);
    expect(update.matches[0].changes.ticket.inserts).toEqual(['t1']);
  });

  test('missing ?name emits subscription:error and closes the stream', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    // openSse normally forces `name`, so bypass it here by writing
    // `name: ''` (treated as missing by the server).
    const stream = await transport.openSse(
      '/events',
      { user: { id: 'u1', workspaceIds: ['w1'] } },
      { name: '', args: {} },
    );

    const error = firstOfType(stream.frames, 'subscription:error');
    expect(error).toBeTruthy();
    expect(stream.closed).toBe(true);
    expect(srv.subscriptionResolver.getRegistry().size()).toBe(0);
  });

  test('malformed ?args (non-JSON) emits subscription:error and closes the stream', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    const stream = await transport.invokeSse('/events', {
      user: { id: 'u1', workspaceIds: ['w1'] },
      query: { name: 'ticketSubscription', args: '{not-json' },
    });

    const error = firstOfType(stream.frames, 'subscription:error');
    expect(error).toBeTruthy();
    expect(stream.closed).toBe(true);
    expect(srv.subscriptionResolver.getRegistry().size()).toBe(0);
  });

  test('closing the SSE stream tears down its subscription', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    const stream = await transport.openSse(
      '/events',
      { user: { id: 'u1', workspaceIds: ['w1'] } },
      { name: 'ticketSubscription', args: { ticketId: 't1' } },
    );

    expect(srv.subscriptionResolver.getRegistry().size()).toBe(1);

    stream.close();

    expect(srv.subscriptionResolver.getRegistry().size()).toBe(0);
  });

  test('after stream close no further batches are delivered', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    const stream = await transport.openSse(
      '/events',
      { user: { id: 'u1', workspaceIds: ['w1'] } },
      { name: 'ticketSubscription', args: { ticketId: 't1' } },
    );

    const frameCountBeforeClose = stream.frames.length;
    stream.close();

    const mutation = await transport.invokePost('/mutation', {
      user: { id: 'u1', workspaceIds: ['w1'] },
      body: { createTicket: { input: { id: 't1', title: 'hello', workspaceId: 'w1' } } },
    });
    await mutation.flushResponse();
    await srv.drainEffects();
    await new Promise((resolve) => setImmediate(resolve));

    expect(stream.frames.length).toBe(frameCountBeforeClose);
  });

  test('subscribers on different streams receive independent updates', async () => {
    const srv = newServer();
    const transport = createFakeHttpTransport();
    srv.attachHttp(transport.adapter);

    const watcher = await transport.openSse(
      '/events',
      { user: { id: 'u1', workspaceIds: ['w1'] } },
      { name: 'ticketSubscription', args: { ticketId: 't1' } },
    );
    const bystander = await transport.openSse(
      '/events',
      { user: { id: 'u2', workspaceIds: ['w2'] } },
      { name: 'ticketSubscription', args: { ticketId: 't1' } },
    );

    const watcherBefore = watcher.frames.length;
    const bystanderBefore = bystander.frames.length;

    const mutation = await transport.invokePost('/mutation', {
      user: { id: 'u1', workspaceIds: ['w1'] },
      body: { createTicket: { input: { id: 't1', title: 'hello', workspaceId: 'w1' } } },
    });
    await mutation.flushResponse();
    await srv.drainEffects();
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    const watcherUpdate = firstOfType(watcher.frames.slice(watcherBefore), 'subscription:batch');
    const bystanderUpdate = firstOfType(bystander.frames.slice(bystanderBefore), 'subscription:batch');

    expect(watcherUpdate).toBeTruthy();
    // The bystander's connection is scoped to workspace w2 but the
    // ticket was inserted into w1, so the subscription's `filter`
    // rejects it.
    expect(bystanderUpdate).toBeUndefined();
  });
});
