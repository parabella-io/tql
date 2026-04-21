import { describe, expect, it, vi } from 'vitest';
import { Client } from '../../src/core/client/client';
import { HttpTransport, WsTransport } from '../../src/core/transports';

type Schema = any;

/** Factory that returns a fake WebSocket-ish socket. The socket
 *  auto-transitions to `open` on the next microtask after a listener
 *  is registered, mirroring how real browser sockets resolve
 *  asynchronously. Use `autoOpen: false` to drive the transition
 *  manually via `open()`. */
const createFakeWs = (options: { autoOpen?: boolean } = {}) => {
  const autoOpen = options.autoOpen ?? true;
  const listeners = {
    open: [] as Array<() => void>,
    close: [] as Array<() => void>,
    error: [] as Array<() => void>,
    message: [] as Array<(event: { data: unknown }) => void>,
  };
  const sent: string[] = [];
  let opened = false;
  const doOpen = () => {
    if (opened) return;
    opened = true;
    socket.readyState = 1;
    for (const listener of listeners.open) listener();
  };
  const socket = {
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
      if (autoOpen && event === 'open') queueMicrotask(doOpen);
    },
  };

  return {
    socket,
    sent,
    open: doOpen,
    emit: (data: string) => {
      for (const listener of listeners.message) listener({ data });
    },
  };
};

describe('Client transport selection', () => {
  it('createQuery with default transport routes through HttpTransport', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      status: 200,
      json: async () => ({ tickets: { data: [], error: null, metadata: {} } }),
    });

    const client = new Client<Schema>({
      transports: {
        http: new HttpTransport({ url: '/api', fetch: fetchSpy }),
      },
    });

    const query = client.createQuery('tickets', {
      queryKey: 'tickets',
      query: () => ({ query: {}, select: true }),
    });

    const response = (await query.execute({})) as any;

    expect(response.tickets).toMatchObject({ data: [], error: null });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0].url).toBe('/api/query');
  });

  it("createQuery({ transport: 'ws' }) lazily opens the WS transport on first execute", async () => {
    const fake = createFakeWs();
    const fetchSpy = vi.fn();

    const wsTransport = new WsTransport({ url: 'ws://test', webSocket: () => fake.socket });

    const client = new Client<Schema>({
      transports: {
        http: new HttpTransport({ url: '/api', fetch: fetchSpy }),
        ws: wsTransport,
      },
    });

    const query = client.createQuery('tickets', {
      queryKey: 'tickets',
      query: () => ({ query: {}, select: true }),
      transport: 'ws',
    });

    const executePromise = query.execute({});

    // The fake socket auto-opens on the next microtask; the transport
    // then sends `connection:init` and waits for `connection:ack`.
    await vi.waitFor(() => expect(fake.sent).toHaveLength(1));
    expect(JSON.parse(fake.sent[0]!)).toEqual({ type: 'connection:init', headers: {} });

    fake.emit(JSON.stringify({ type: 'connection:ack' }));

    await vi.waitFor(() => expect(fake.sent).toHaveLength(2));

    const envelope = JSON.parse(fake.sent[1]!);
    expect(envelope.type).toBe('query');

    fake.emit(
      JSON.stringify({
        id: envelope.id,
        type: 'query:result',
        payload: { tickets: { data: [{ id: 't1' }], error: null, metadata: {} } },
      }),
    );

    const response = (await executePromise) as any;
    expect(response.tickets).toEqual({ data: [{ id: 't1' }], error: null, metadata: {} });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("createQuery({ transport: 'ws' }) throws at createQuery time when ws is not configured", async () => {
    const client = new Client<Schema>({
      transports: {
        http: new HttpTransport({ url: '/api', fetch: vi.fn() }),
      },
    });

    expect(() =>
      client.createQuery('tickets', {
        queryKey: 'tickets',
        query: () => ({ query: {}, select: true }),
        transport: 'ws',
      }),
    ).toThrow(/transports.ws/);
  });
});
