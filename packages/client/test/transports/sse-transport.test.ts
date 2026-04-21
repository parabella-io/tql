import { describe, expect, it, vi } from 'vitest';
import { SseTransport, EventSourceLike } from '../../src/core/transports';

const createFakeEventSource = () => {
  const listeners = {
    open: [] as Array<() => void>,
    error: [] as Array<(event?: unknown) => void>,
    message: [] as Array<(event: { data: string }) => void>,
  };

  const source: EventSourceLike = {
    readyState: 0,
    close() {
      // no-op; tests fire `error` manually when simulating closes.
    },
    addEventListener(event: string, listener: any) {
      (listeners as any)[event].push(listener);
    },
  };

  return {
    source,
    emit: (message: unknown) => {
      for (const listener of listeners.message) listener({ data: JSON.stringify(message) });
    },
  };
};

describe('SseTransport', () => {
  it('connect() resolves on the first connection:ready frame and captures connectionId', async () => {
    const fake = createFakeEventSource();

    const transport = new SseTransport({
      eventsUrl: '/events',
      subscribeUrl: '/subscribe',
      unsubscribeUrl: '/unsubscribe',
      eventSource: () => fake.source,
      fetch: vi.fn(),
    });

    const connectPromise = transport.connect();
    fake.emit({ type: 'connection:ready', connectionId: 'c-1' });

    await connectPromise;
    expect(transport.isConnected()).toBe(true);
  });

  it('subscribe() POSTs to subscribeUrl with the captured connectionId and resolves with subscriptionId', async () => {
    const fake = createFakeEventSource();

    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ subscriptionId: 'sub-1' }) });

    const transport = new SseTransport({
      eventsUrl: '/events',
      subscribeUrl: '/subscribe',
      unsubscribeUrl: '/unsubscribe',
      eventSource: () => fake.source,
      fetch: fetchSpy,
    });

    const connectPromise = transport.connect();
    fake.emit({ type: 'connection:ready', connectionId: 'c-1' });
    await connectPromise;

    const handle = await transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch: vi.fn() },
    });

    expect(handle.subscriptionId).toBe('sub-1');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [body] = fetchSpy.mock.calls[0] as [{ url: string; body: string }];
    expect(body.url).toBe('/subscribe');
    const parsed = JSON.parse(body.body);
    expect(parsed).toMatchObject({
      connectionId: 'c-1',
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
    });
  });

  it('subscription:batch frames get routed to the matching listener by subscriptionId', async () => {
    const fake = createFakeEventSource();

    const fetchSpy = vi.fn().mockResolvedValue({ status: 200, json: async () => ({ subscriptionId: 'sub-1' }) });

    const transport = new SseTransport({
      eventsUrl: '/events',
      subscribeUrl: '/subscribe',
      unsubscribeUrl: '/unsubscribe',
      eventSource: () => fake.source,
      fetch: fetchSpy,
    });

    const connectPromise = transport.connect();
    fake.emit({ type: 'connection:ready', connectionId: 'c-1' });
    await connectPromise;

    const onBatch = vi.fn();
    await transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch },
    });

    fake.emit({
      type: 'subscription:batch',
      rows: { ticket: { inserts: { t1: { id: 't1', title: 'hello' } } } },
      matches: [{ id: 'sub-1', name: 'ticketSubscription', changes: { ticket: { inserts: ['t1'] } } }],
    });

    expect(onBatch).toHaveBeenCalledTimes(1);
    expect(onBatch.mock.calls[0][0].rows.ticket.inserts.t1.title).toBe('hello');
  });

  it('subscribe() before connect() throws', async () => {
    const fake = createFakeEventSource();

    const transport = new SseTransport({
      eventsUrl: '/events',
      subscribeUrl: '/subscribe',
      unsubscribeUrl: '/unsubscribe',
      eventSource: () => fake.source,
      fetch: vi.fn(),
    });

    await expect(
      transport.subscribe({
        name: 'ticketSubscription',
        args: { ticketId: 't1' },
        listener: { onBatch: vi.fn() },
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
