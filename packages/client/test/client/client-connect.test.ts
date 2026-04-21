import { describe, expect, it, vi } from 'vitest';
import { Client } from '../../src/core/client/client';
import { HttpTransport, SseTransport, SubscriptionTransport, WsTransport } from '../../src/core/transports';

type Schema = any;

/** Minimal stub that looks like a SubscriptionTransport but counts
 *  connect/disconnect + remembers live subscriptions so the test can
 *  assert the auto lifecycle. */
const createStubTransport = () => {
  let connected = false;
  const subscribeCalls: Array<{ unsubscribe: ReturnType<typeof vi.fn> }> = [];
  const connectSpy = vi.fn(async () => {
    connected = true;
  });
  const disconnectSpy = vi.fn(async () => {
    connected = false;
  });

  const transport: SubscriptionTransport = {
    connect: connectSpy,
    disconnect: disconnectSpy,
    isConnected() {
      return connected;
    },
    async subscribe({ listener }) {
      void listener;
      const unsubscribe = vi.fn(async () => {});
      const entry = { unsubscribe };
      subscribeCalls.push(entry);
      return { subscriptionId: `sub-${subscribeCalls.length}`, unsubscribe };
    },
  };

  return { transport, subscribeCalls, connectSpy, disconnectSpy };
};

/** Build a Client whose SSE transport forwards to the stub. We keep
 *  the real SseTransport identity so the Client's construction code
 *  is exercised end-to-end. */
const buildClientWithTransport = (stub: ReturnType<typeof createStubTransport>) => {
  const sseTransport = new SseTransport({
    eventsUrl: '/events',
    eventSource: () => ({
      readyState: 0,
      close() {},
      addEventListener() {},
    }),
  });

  (sseTransport as any).connect = stub.transport.connect.bind(stub.transport);
  (sseTransport as any).disconnect = stub.transport.disconnect.bind(stub.transport);
  (sseTransport as any).isConnected = stub.transport.isConnected.bind(stub.transport);
  (sseTransport as any).subscribe = stub.transport.subscribe.bind(stub.transport);

  return new Client<Schema>({
    transports: {
      http: new HttpTransport({ url: '/api', fetch: vi.fn() }),
      sse: sseTransport,
    },
  });
};

describe('Client auto connect / disconnect lifecycle', () => {
  it('first subscribe() opens the transport lazily', async () => {
    const stub = createStubTransport();
    const client = buildClientWithTransport(stub);

    const subscription = client.createSubscription('ticketSubscription', {
      subscriptionKey: 'ticketSubscription',
      args: (params: any) => ({ ticketId: params.ticketId }),
    });

    expect(stub.connectSpy).not.toHaveBeenCalled();

    await subscription.subscribe({ ticketId: 't1' });

    expect(stub.connectSpy).toHaveBeenCalledTimes(1);
    expect(stub.subscribeCalls).toHaveLength(1);
  });

  it('concurrent subscribes share a single connect() call', async () => {
    const stub = createStubTransport();
    const client = buildClientWithTransport(stub);

    const subscription = client.createSubscription('ticketSubscription', {
      subscriptionKey: 'ticketSubscription',
      args: (params: any) => ({ ticketId: params.ticketId }),
    });

    await Promise.all([
      subscription.subscribe({ ticketId: 't1' }),
      subscription.subscribe({ ticketId: 't2' }),
      subscription.subscribe({ ticketId: 't3' }),
    ]);

    expect(stub.connectSpy).toHaveBeenCalledTimes(1);
    expect(stub.subscribeCalls).toHaveLength(3);
  });

  it('subsequent subscribes reuse an already-open transport', async () => {
    const stub = createStubTransport();
    const client = buildClientWithTransport(stub);

    const subscription = client.createSubscription('ticketSubscription', {
      subscriptionKey: 'ticketSubscription',
      args: (params: any) => ({ ticketId: params.ticketId }),
    });

    await subscription.subscribe({ ticketId: 't1' });
    await subscription.subscribe({ ticketId: 't2' });

    expect(stub.connectSpy).toHaveBeenCalledTimes(1);
  });

  it('unsubscribing the last active subscription auto-disconnects', async () => {
    const stub = createStubTransport();
    const client = buildClientWithTransport(stub);

    const subscription = client.createSubscription('ticketSubscription', {
      subscriptionKey: 'ticketSubscription',
      args: (params: any) => ({ ticketId: params.ticketId }),
    });

    await subscription.subscribe({ ticketId: 't1' });
    await subscription.subscribe({ ticketId: 't2' });

    expect(stub.disconnectSpy).not.toHaveBeenCalled();

    await subscription.unsubscribe({ ticketId: 't1' });
    expect(stub.disconnectSpy).not.toHaveBeenCalled();

    await subscription.unsubscribe({ ticketId: 't2' });

    // The last unsubscribe triggers teardown (fired async, but awaited
    // by the Set delete → release microtask; we flush by yielding).
    await Promise.resolve();
    expect(stub.disconnectSpy).toHaveBeenCalledTimes(1);
  });

  it('re-subscribing after auto-disconnect re-opens the transport', async () => {
    const stub = createStubTransport();
    const client = buildClientWithTransport(stub);

    const subscription = client.createSubscription('ticketSubscription', {
      subscriptionKey: 'ticketSubscription',
      args: (params: any) => ({ ticketId: params.ticketId }),
    });

    await subscription.subscribe({ ticketId: 't1' });
    await subscription.unsubscribe({ ticketId: 't1' });
    await Promise.resolve();

    expect(stub.disconnectSpy).toHaveBeenCalledTimes(1);

    await subscription.subscribe({ ticketId: 't2' });
    expect(stub.connectSpy).toHaveBeenCalledTimes(2);
  });

  it("transport: 'ws' query opens the WS transport on first execute", async () => {
    const listeners: { open: Array<() => void>; message: Array<(e: { data: unknown }) => void> } = {
      open: [],
      message: [],
    };
    const sent: string[] = [];
    const socket = {
      readyState: 0,
      send(data: string) {
        sent.push(data);
      },
      close() {},
      addEventListener(event: string, listener: any) {
        (listeners as any)[event]?.push(listener);
        if (event === 'open') {
          queueMicrotask(() => {
            socket.readyState = 1;
            listener();
          });
        }
      },
    };
    const webSocketFactory = vi.fn(() => socket);

    const client = new Client<Schema>({
      transports: {
        http: new HttpTransport({ url: '/api', fetch: vi.fn() }),
        ws: new WsTransport({ url: 'ws://test', webSocket: webSocketFactory }),
      },
    });

    const query = client.createQuery('tickets', {
      queryKey: 'tickets',
      query: () => ({ query: {}, select: true }),
      transport: 'ws',
    });

    const executePromise = query.execute({});

    await vi.waitFor(() => expect(sent).toHaveLength(1));
    expect(webSocketFactory).toHaveBeenCalledTimes(1);

    const envelope = JSON.parse(sent[0]!);
    for (const listener of listeners.message) {
      listener({ data: JSON.stringify({ id: envelope.id, type: 'query:result', payload: { tickets: { data: [], error: null, metadata: {} } } }) });
    }

    await executePromise;
  });

  it('throws when both ws + sse are configured without an explicit subscriptionTransport', () => {
    const createFakeWs = () => ({
      readyState: 0,
      send() {},
      close() {},
      addEventListener() {},
    });

    expect(
      () =>
        new Client<Schema>({
          transports: {
            http: new HttpTransport({ url: '/api', fetch: vi.fn() }),
            ws: new WsTransport({ url: 'ws://test', webSocket: createFakeWs }),
            sse: new SseTransport({
              eventsUrl: '/events',
              eventSource: () => ({
                readyState: 0,
                close() {},
                addEventListener() {},
              }),
            }),
          },
        }),
    ).toThrow(/subscriptionTransport/);
  });
});
