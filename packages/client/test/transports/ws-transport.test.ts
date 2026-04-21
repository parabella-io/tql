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

describe('WsTransport', () => {
  it('connect() resolves when the socket opens', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    fake.open();

    await expect(connectPromise).resolves.toBeUndefined();
    expect(transport.isConnected()).toBe(true);
  });

  it('query() sends a query envelope and resolves with the matching query:result payload', async () => {
    const fake = createFakeSocket();
    const transport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const connectPromise = transport.connect();
    fake.open();
    await connectPromise;

    const queryPromise = transport.query({ tickets: { query: {}, select: true } });

    // The first message sent must include the envelope with a correlation id.
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
    fake.open();
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
    fake.open();
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
    fake.open();
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
    fake.open();
    await connectPromise;

    const queryPromise = transport.query({ tickets: { query: {}, select: true } });

    await transport.disconnect();

    await expect(queryPromise).rejects.toBeInstanceOf(Error);
    expect(transport.isConnected()).toBe(false);
  });
});
