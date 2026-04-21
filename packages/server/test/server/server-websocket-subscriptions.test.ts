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

      return {
        connection,
        sent,
        async deliver(data) {
          for (const listener of messageListeners) listener(data);
          // Yield the microtask queue so async handlers settle before the
          // test asserts on `sent`.
          await new Promise((resolve) => setImmediate(resolve));
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
    // Let attachWebSocket's async context init settle.
    await new Promise((resolve) => setImmediate(resolve));

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
    await new Promise((resolve) => setImmediate(resolve));

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
    await new Promise((resolve) => setImmediate(resolve));

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
    await new Promise((resolve) => setImmediate(resolve));

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
    await new Promise((resolve) => setImmediate(resolve));

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
      await new Promise((resolve) => setImmediate(resolve));

      await conn.deliver(JSON.stringify({ id: 'q-1', type: 'query', payload: {} }));

      const message = parseLastMessage(conn.sent);
      expect(message.type).toBe('query:result');
    } finally {
      srv.dispose();
    }

    // Silence the "unused" warning on vi; the spec relies on the mock only for parity.
    void vi;
  });
});
