import { afterEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { Server } from '../../src/server/server.js';
import type { WebSocketAdapter, WebSocketConnection } from '../../src/server/adapters/websocket/websocket-adapter.js';

type Ticket = SchemaEntity<{ title: string; workspaceId: string }>;

type Entities = {
  ticket: Ticket;
};

type Context = {
  userId: string;
  canSubscribe: boolean;
};

type Connection = {
  workspaceIds: string[];
};

type FakeConnectionRequest = {
  user: { id: string; workspaceIds: string[]; canSubscribe: boolean };
};

type FakeWsConnection = {
  connection: WebSocketConnection;
  sent: string[];
  deliver(data: string): Promise<void>;
  handshake(headers?: Record<string, string>): Promise<void>;
  close(): void;
};

type FakeWsAdapter = {
  adapter: WebSocketAdapter;
  connect(request: FakeConnectionRequest): FakeWsConnection;
};

const createFakeWsAdapter = (): FakeWsAdapter => {
  const handlers: Array<(connection: WebSocketConnection) => void> = [];

  const adapter: WebSocketAdapter = {
    onConnection(handler) {
      handlers.push(handler);
    },
  };

  let nextId = 0;

  return {
    adapter,
    connect(request) {
      const id = `fake-${++nextId}`;
      const messageListeners: Array<(data: string) => void> = [];
      const closeListeners: Array<() => void> = [];
      const sent: string[] = [];

      const connection: WebSocketConnection = {
        id,
        request,
        send(data) {
          sent.push(data);
        },
        close() {
          for (const listener of closeListeners) listener();
        },
        onMessage(listener) {
          messageListeners.push(listener);
        },
        onClose(listener) {
          closeListeners.push(listener);
        },
      };

      for (const handler of handlers) handler(connection);

      const deliver = async (data: string) => {
        for (const listener of messageListeners) listener(data);
        // Yield the microtask queue so async handlers settle before the
        // test asserts on `sent`.
        await new Promise((resolve) => setImmediate(resolve));
      };

      return {
        connection,
        sent,
        deliver,
        async handshake(headers = {}) {
          await deliver(JSON.stringify({ type: 'connection:init', headers }));
        },
        close() {
          for (const listener of closeListeners) listener();
        },
      };
    },
  };
};

const buildSchema = () => {
  const schema = new Schema<Context, Entities, Connection>();

  schema.subscription('ticketSubscription', {
    args: z.object({ ticketId: z.string() }),
    subscribeTo: { ticket: true },
    allow: async ({ context }) => context.canSubscribe,
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

const parseLastMessage = (sent: string[]): any => {
  if (sent.length === 0) throw new Error('no messages sent');
  return JSON.parse(sent[sent.length - 1]!);
};

const findMessage = (sent: string[], predicate: (msg: any) => boolean): any | undefined => {
  for (const raw of sent) {
    const parsed = JSON.parse(raw);
    if (predicate(parsed)) return parsed;
  }
  return undefined;
};

describe('Server.attachWebSocket', () => {
  let server: Server<any, Connection> | undefined;

  afterEach(() => {
    server?.dispose();
    server = undefined;
  });

  test('subscribe -> mutation emit -> subscription:batch delivered to matching sockets only', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { userId: r.user.id, canSubscribe: r.user.canSubscribe };
      },
      createConnection: ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });

    server.attachWebSocket(adapter.adapter);

    const watcher = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });
    const bystander = adapter.connect({ user: { id: 'u2', workspaceIds: ['w2'], canSubscribe: true } });
    await watcher.handshake();
    await bystander.handshake();

    await watcher.deliver(JSON.stringify({ id: 'sub-1', type: 'subscribe', name: 'ticketSubscription', args: { ticketId: 't1' } }));
    await bystander.deliver(JSON.stringify({ id: 'sub-2', type: 'subscribe', name: 'ticketSubscription', args: { ticketId: 't1' } }));

    const watcherAck = findMessage(watcher.sent, (m) => m.type === 'subscribe:ack');
    const bystanderAck = findMessage(bystander.sent, (m) => m.type === 'subscribe:ack');
    expect(watcherAck).toBeTruthy();
    expect(bystanderAck).toBeTruthy();

    watcher.sent.length = 0;
    bystander.sent.length = 0;

    await watcher.deliver(
      JSON.stringify({
        id: 'mut-1',
        type: 'mutation',
        payload: { createTicket: { input: { id: 't1', title: 'hello', workspaceId: 'w1' } } },
      }),
    );

    await server!.drainEffects();
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    const mutationAck = findMessage(watcher.sent, (m) => m.type === 'mutation:result');
    expect(mutationAck).toBeTruthy();

    const watcherUpdate = findMessage(watcher.sent, (m) => m.type === 'subscription:batch');
    expect(watcherUpdate).toBeTruthy();
    expect(watcherUpdate.rows.ticket.inserts.t1).toMatchObject({ id: 't1', title: 'hello', workspaceId: 'w1' });
    expect(watcherUpdate.matches).toHaveLength(1);
    expect(watcherUpdate.matches[0].name).toBe('ticketSubscription');
    expect(watcherUpdate.matches[0].changes.ticket.inserts).toEqual(['t1']);

    const bystanderUpdate = findMessage(bystander.sent, (m) => m.type === 'subscription:batch');
    expect(bystanderUpdate).toBeUndefined();
  });

  test('rejects subscribe when allow returns false', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { userId: r.user.id, canSubscribe: r.user.canSubscribe };
      },
      createConnection: ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });

    server.attachWebSocket(adapter.adapter);

    const unauth = adapter.connect({ user: { id: 'u3', workspaceIds: ['w1'], canSubscribe: false } });
    await unauth.handshake();

    await unauth.deliver(JSON.stringify({ id: 'sub-3', type: 'subscribe', name: 'ticketSubscription', args: { ticketId: 't1' } }));

    const message = parseLastMessage(unauth.sent);
    expect(message.type).toBe('subscribe:error');
  });

  test('unsubscribe stops future updates', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { userId: r.user.id, canSubscribe: r.user.canSubscribe };
      },
      createConnection: ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });

    server.attachWebSocket(adapter.adapter);

    const watcher = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });
    await watcher.handshake();

    await watcher.deliver(JSON.stringify({ id: 'sub-1', type: 'subscribe', name: 'ticketSubscription', args: { ticketId: 't1' } }));
    const ack = findMessage(watcher.sent, (m) => m.type === 'subscribe:ack');
    expect(ack?.subscriptionId).toBeTruthy();

    await watcher.deliver(JSON.stringify({ id: 'uns-1', type: 'unsubscribe', subscriptionId: ack.subscriptionId }));

    watcher.sent.length = 0;

    await watcher.deliver(
      JSON.stringify({
        id: 'mut-1',
        type: 'mutation',
        payload: { createTicket: { input: { id: 't1', title: 'hello', workspaceId: 'w1' } } },
      }),
    );

    await server!.drainEffects();
    await new Promise((resolve) => setImmediate(resolve));

    const update = findMessage(watcher.sent, (m) => m.type === 'subscription:batch');
    expect(update).toBeUndefined();
  });

  test('closing the socket cleans up its subscriptions', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { userId: r.user.id, canSubscribe: r.user.canSubscribe };
      },
      createConnection: ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });

    server.attachWebSocket(adapter.adapter);

    const watcher = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });
    await watcher.handshake();

    await watcher.deliver(JSON.stringify({ id: 'sub-1', type: 'subscribe', name: 'ticketSubscription', args: { ticketId: 't1' } }));
    expect(server.subscriptionResolver.getRegistry().size()).toBe(1);

    watcher.close();

    expect(server.subscriptionResolver.getRegistry().size()).toBe(0);
  });

  test('rejects malformed JSON frames', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { userId: r.user.id, canSubscribe: r.user.canSubscribe };
      },
      createConnection: ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });

    server.attachWebSocket(adapter.adapter);

    const conn = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });
    await conn.handshake();
    conn.sent.length = 0;

    await conn.deliver('not json');

    const message = parseLastMessage(conn.sent);
    expect(message.type).toBe('error');
  });

  test('query frames are resolved via the same socket', async () => {
    const schema = new Schema<Context, Entities, Connection>();
    schema.mutation('noop', {
      input: z.object({}),
      allow: () => true,
      resolve: async () => {},
    });

    const adapter = createFakeWsAdapter();

    const srv = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async () => ({ userId: 'u1', canSubscribe: false }),
    });

    try {
      srv.attachWebSocket(adapter.adapter);

      const conn = adapter.connect({ user: { id: 'u1', workspaceIds: [], canSubscribe: false } });
      await conn.handshake();

      await conn.deliver(JSON.stringify({ id: 'q-1', type: 'query', payload: {} }));

      const message = parseLastMessage(conn.sent);
      expect(message.type).toBe('query:result');
    } finally {
      srv.dispose();
    }

    // Silence the "unused" warning on vi; the spec relies on the mock only for parity.
    void vi;
  });

  test('connection:init sends connection:ack and calls createContext exactly once', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    const createContextSpy = vi.fn(async ({ request }: { request: any }) => {
      const r = request as FakeConnectionRequest;
      return { userId: r.user.id, canSubscribe: r.user.canSubscribe };
    });

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: createContextSpy,
      createConnection: ({ request }) => {
        const r = request as FakeConnectionRequest;
        return { workspaceIds: r.user.workspaceIds };
      },
    });

    server.attachWebSocket(adapter.adapter);

    const conn = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });

    expect(createContextSpy).not.toHaveBeenCalled();

    await conn.handshake();

    expect(createContextSpy).toHaveBeenCalledTimes(1);

    const ack = findMessage(conn.sent, (m) => m.type === 'connection:ack');
    expect(ack).toBeTruthy();

    const ackCount = conn.sent.filter((raw) => JSON.parse(raw).type === 'connection:ack').length;
    expect(ackCount).toBe(1);
  });

  test('connection:init headers are merged onto the upgrade request before createContext runs', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    const createContextSpy = vi.fn(async ({ request }: { request: any }) => {
      return { userId: 'u1', canSubscribe: true, headers: request.headers };
    });

    const createConnectionSpy = vi.fn(({ request }: { request: any }) => {
      return { workspaceIds: ['w1'], headers: request.headers };
    });

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: createContextSpy,
      createConnection: createConnectionSpy,
    });

    server.attachWebSocket(adapter.adapter);

    const request = {
      headers: { 'x-base': 'from-upgrade' },
      user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true },
    };

    const conn = adapter.connect(request as unknown as FakeConnectionRequest);

    await conn.handshake({ authorization: 'Bearer token-from-init', 'x-extra': 'hello' });

    expect(createContextSpy).toHaveBeenCalledTimes(1);
    const forwardedHeaders = createContextSpy.mock.calls[0]![0].request.headers;
    expect(forwardedHeaders).toEqual({
      'x-base': 'from-upgrade',
      authorization: 'Bearer token-from-init',
      'x-extra': 'hello',
    });

    const forwardedConnHeaders = createConnectionSpy.mock.calls[0]![0].request.headers;
    expect(forwardedConnHeaders).toEqual(forwardedHeaders);
  });

  test('frames received before connection:init are rejected with connection:error and close the socket', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    const closeListeners: Array<() => void> = [];

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async () => ({ userId: 'u1', canSubscribe: true }),
      createConnection: () => ({ workspaceIds: ['w1'] }),
    });

    server.attachWebSocket(adapter.adapter);

    const conn = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });
    conn.connection.onClose(() => closeListeners.push(() => {}));

    await conn.deliver(JSON.stringify({ id: 'q-1', type: 'query', payload: {} }));

    const error = findMessage(conn.sent, (m) => m.type === 'connection:error');
    expect(error).toBeTruthy();
    expect(closeListeners.length).toBeGreaterThan(0);
  });

  test('a second connection:init is rejected with connection:error', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async () => ({ userId: 'u1', canSubscribe: true }),
      createConnection: () => ({ workspaceIds: ['w1'] }),
    });

    server.attachWebSocket(adapter.adapter);

    const conn = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });

    await conn.handshake();
    const firstAck = findMessage(conn.sent, (m) => m.type === 'connection:ack');
    expect(firstAck).toBeTruthy();

    conn.sent.length = 0;

    await conn.handshake({ authorization: 'Bearer nope' });

    const error = findMessage(conn.sent, (m) => m.type === 'connection:error');
    expect(error).toBeTruthy();
    expect(findMessage(conn.sent, (m) => m.type === 'connection:ack')).toBeUndefined();
  });

  test('connection:init with non-string header values is rejected', async () => {
    const schema = buildSchema();
    const adapter = createFakeWsAdapter();

    server = new Server<any, Connection>({
      schema,
      generateSchema: { enabled: false },
      createContext: async () => ({ userId: 'u1', canSubscribe: true }),
      createConnection: () => ({ workspaceIds: ['w1'] }),
    });

    server.attachWebSocket(adapter.adapter);

    const conn = adapter.connect({ user: { id: 'u1', workspaceIds: ['w1'], canSubscribe: true } });

    await conn.deliver(JSON.stringify({ type: 'connection:init', headers: { bad: 42 } }));

    const message = parseLastMessage(conn.sent);
    expect(message.type).toBe('error');
  });
});
