import { describe, expect, it, vi } from 'vitest';

import { WsTransport, WebSocketLike } from '../../src/core/transports';

/** Fake `WebSocket` that lets the test drive readyState + emit frames. */
const createFakeSocket = () => {
  const listeners = {
    open: [] as Array<() => void>,
    close: [] as Array<() => void>,
    error: [] as Array<(event?: unknown) => void>,
    message: [] as Array<(event: { data: unknown }) => void>,
  };

  const sent: string[] = [];

  const socket: WebSocketLike & { readyState: number } = {
    readyState: 0,
    send(data: string) {
      sent.push(data);
    },
    close() {
      socket.readyState = 3;
      for (const listener of listeners.close) listener();
    },
    addEventListener(event: string, listener: any) {
      (listeners as any)[event].push(listener);
    },
  };

  return {
    socket,
    sent,
    open: () => {
      socket.readyState = 1;
      for (const listener of listeners.open) listener();
    },
    emit: (data: string) => {
      for (const listener of listeners.message) listener({ data });
    },
    fireError: () => {
      for (const listener of listeners.error) listener();
    },
    close: () => socket.close(),
  };
};

/**
 * Drives the handshake forward: flush the pending `getHeaders()`
 * promise, wait for `connection:init` to show up on the wire, emit
 * `connection:ack`, and clear the `sent` buffer so subsequent
 * assertions can look at `sent[0]` like they did before the handshake
 * existed.
 */
const handshake = async (fake: ReturnType<typeof createFakeSocket>): Promise<void> => {
  fake.open();
  for (let attempt = 0; attempt < 10 && fake.sent.length === 0; attempt++) {
    await Promise.resolve();
  }
  fake.emit(JSON.stringify({ type: 'connection:ack' }));
  await Promise.resolve();
  fake.sent.length = 0;
};

describe('WsTransport', () => {
  it('connect() resolves after the server acks connection:init', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    fake.open();
    for (let attempt = 0; attempt < 10 && fake.sent.length === 0; attempt++) {
      await Promise.resolve();
    }

    expect(fake.sent).toHaveLength(1);
    const init = JSON.parse(fake.sent[0]!);
    expect(init).toEqual({ type: 'connection:init', headers: {} });

    expect(transport.isConnected()).toBe(false);

    fake.emit(JSON.stringify({ type: 'connection:ack' }));

    await expect(connectPromise).resolves.toBeUndefined();
    expect(transport.isConnected()).toBe(true);
  });

  it('connect() forwards sync and async headers in connection:init', async () => {
    const syncFake = createFakeSocket();
    const syncTransport = new WsTransport({
      url: 'ws://test',
      webSocket: () => syncFake.socket,
      headers: () => ({ authorization: 'Bearer sync-token' }),
    });

    const syncConnect = syncTransport.connect();
    syncFake.open();
    for (let attempt = 0; attempt < 10 && syncFake.sent.length === 0; attempt++) {
      await Promise.resolve();
    }

    expect(JSON.parse(syncFake.sent[0]!)).toEqual({
      type: 'connection:init',
      headers: { authorization: 'Bearer sync-token' },
    });

    syncFake.emit(JSON.stringify({ type: 'connection:ack' }));
    await syncConnect;

    const asyncFake = createFakeSocket();
    const asyncTransport = new WsTransport({
      url: 'ws://test',
      webSocket: () => asyncFake.socket,
      headers: async () => ({ authorization: 'Bearer async-token' }),
    });

    const asyncConnect = asyncTransport.connect();
    asyncFake.open();
    for (let attempt = 0; attempt < 10 && asyncFake.sent.length === 0; attempt++) {
      await Promise.resolve();
    }

    expect(JSON.parse(asyncFake.sent[0]!)).toEqual({
      type: 'connection:init',
      headers: { authorization: 'Bearer async-token' },
    });

    asyncFake.emit(JSON.stringify({ type: 'connection:ack' }));
    await asyncConnect;
  });

  it('connect() rejects and closes the socket when the server sends connection:error during the handshake', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    fake.open();
    for (let attempt = 0; attempt < 10 && fake.sent.length === 0; attempt++) {
      await Promise.resolve();
    }

    fake.emit(JSON.stringify({ type: 'connection:error', error: { message: 'nope' } }));

    await expect(connectPromise).rejects.toMatchObject({ message: 'nope' });
    expect(fake.socket.readyState).toBe(3);
    expect(transport.isConnected()).toBe(false);
  });

  it('connect() rejects when the socket closes before connection:ack', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    fake.open();
    for (let attempt = 0; attempt < 10 && fake.sent.length === 0; attempt++) {
      await Promise.resolve();
    }

    fake.close();

    await expect(connectPromise).rejects.toBeInstanceOf(Error);
    expect(transport.isConnected()).toBe(false);
  });

  it('forwards withCredentials into the factory, defaulting to true', async () => {
    const seen: Array<{ withCredentials: boolean }> = [];
    const fake = createFakeSocket();
    const transport = new WsTransport({
      url: 'ws://test',
      webSocket: (_url, options) => {
        seen.push(options);
        return fake.socket;
      },
    });

    const connectPromise = transport.connect();
    await handshake(fake);
    await connectPromise;

    expect(seen).toEqual([{ withCredentials: true }]);

    const explicit = createFakeSocket();
    const explicitTransport = new WsTransport({
      url: 'ws://test',
      withCredentials: false,
      webSocket: (_url, options) => {
        seen.push(options);
        return explicit.socket;
      },
    });

    const explicitConnect = explicitTransport.connect();
    await handshake(explicit);
    await explicitConnect;

    expect(seen[1]).toEqual({ withCredentials: false });
  });

  it('query() sends a query envelope and resolves with the matching query:result payload', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    await handshake(fake);
    await connectPromise;

    const queryPromise = transport.query({ tickets: { query: {}, select: true } });

    expect(fake.sent).toHaveLength(1);
    const envelope = JSON.parse(fake.sent[0]!);
    expect(envelope).toMatchObject({ type: 'query', payload: { tickets: { query: {}, select: true } } });
    const correlationId = envelope.id as string;
    expect(typeof correlationId).toBe('string');

    fake.emit(
      JSON.stringify({
        id: correlationId,
        type: 'query:result',
        payload: { tickets: { data: [], error: null, metadata: {} } },
      }),
    );

    await expect(queryPromise).resolves.toEqual({ tickets: { data: [], error: null, metadata: {} } });
  });

  it('query:error frame rejects the pending promise', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    await handshake(fake);
    await connectPromise;

    const queryPromise = transport.query({ tickets: { query: {}, select: true } });
    const correlationId = JSON.parse(fake.sent[0]!).id as string;

    fake.emit(JSON.stringify({ id: correlationId, type: 'query:error', error: { type: 'boom' } }));

    await expect(queryPromise).rejects.toEqual({ type: 'boom' });
  });

  it('subscribe() resolves on subscribe:ack and routes subscription:batch to the listener', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    await handshake(fake);
    await connectPromise;

    const onBatch = vi.fn();

    const subscribePromise = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch },
    });

    const subEnvelope = JSON.parse(fake.sent[0]!);
    expect(subEnvelope.type).toBe('subscribe');

    fake.emit(JSON.stringify({ id: subEnvelope.id, type: 'subscribe:ack', subscriptionId: 'server-1' }));

    const handle = await subscribePromise;
    expect(handle.subscriptionId).toBe('server-1');

    fake.emit(
      JSON.stringify({
        type: 'subscription:batch',
        rows: { ticket: { inserts: { t1: { id: 't1', title: 'hello' } } } },
        matches: [{ id: 'server-1', name: 'ticketSubscription', changes: { ticket: { inserts: ['t1'] } } }],
      }),
    );

    expect(onBatch).toHaveBeenCalledTimes(1);
    expect(onBatch.mock.calls[0][0].matches[0].id).toBe('server-1');
  });

  it('a subscription:batch that does not include a listener id is ignored', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });
    const connectPromise = transport.connect();
    await handshake(fake);
    await connectPromise;

    const onBatch = vi.fn();
    const promise = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch },
    });
    const id = JSON.parse(fake.sent[0]!).id;
    fake.emit(JSON.stringify({ id, type: 'subscribe:ack', subscriptionId: 'server-1' }));
    await promise;

    fake.emit(
      JSON.stringify({
        type: 'subscription:batch',
        rows: {},
        matches: [{ id: 'other-sub', name: 'x', changes: {} }],
      }),
    );

    expect(onBatch).not.toHaveBeenCalled();
  });

  it('disconnect() rejects outstanding query promises', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });
    const connectPromise = transport.connect();
    await handshake(fake);
    await connectPromise;

    const queryPromise = transport.query({ tickets: { query: {}, select: true } });

    await transport.disconnect();

    await expect(queryPromise).rejects.toBeInstanceOf(Error);
    expect(transport.isConnected()).toBe(false);
  });
});
