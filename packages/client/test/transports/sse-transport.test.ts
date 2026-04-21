import { describe, expect, it, vi } from 'vitest';
import { SseTransport, EventSourceLike } from '../../src/core/transports';

type FakeEventSource = {
  source: EventSourceLike & { closed: boolean; url: string };
  emit: (message: unknown) => void;
  emitError: (event?: unknown) => void;
};

const createFakeEventSource = (url: string): FakeEventSource => {
  const listeners = {
    open: [] as Array<() => void>,
    error: [] as Array<(event?: unknown) => void>,
    message: [] as Array<(event: { data: string }) => void>,
  };

  const source = {
    readyState: 0,
    url,
    closed: false,
    close() {
      source.closed = true;
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
    emitError: (event?: unknown) => {
      for (const listener of listeners.error) listener(event);
    },
  };
};

describe('SseTransport', () => {
  it('subscribe() opens a dedicated EventSource with ?name and ?args and resolves on subscription:ready', async () => {
    const fakes: FakeEventSource[] = [];

    const transport = new SseTransport({
      eventsUrl: 'http://localhost:3000/events',
      eventSource: (url) => {
        const fake = createFakeEventSource(url);
        fakes.push(fake);
        return fake.source;
      },
    });

    const pending = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch: vi.fn() },
    });

    expect(fakes).toHaveLength(1);
    const url = new URL(fakes[0]!.source.url);
    expect(url.pathname).toBe('/events');
    expect(url.searchParams.get('name')).toBe('ticketSubscription');
    expect(JSON.parse(url.searchParams.get('args') ?? '{}')).toEqual({ ticketId: 't1' });

    fakes[0]!.emit({ type: 'subscription:ready', subscriptionId: 'sub-1' });

    const handle = await pending;
    expect(handle.subscriptionId).toBe('sub-1');
  });

  it('delivers subscription:batch frames to the subscribe()-scoped listener', async () => {
    let fake: FakeEventSource | undefined;
    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: (url) => {
        fake = createFakeEventSource(url);
        return fake.source;
      },
    });

    const onBatch = vi.fn();
    const pending = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch },
    });

    fake!.emit({ type: 'subscription:ready', subscriptionId: 'sub-1' });
    await pending;

    fake!.emit({
      type: 'subscription:batch',
      rows: { ticket: { inserts: { t1: { id: 't1', title: 'hello' } } } },
      matches: [{ id: 'sub-1', name: 'ticketSubscription', changes: { ticket: { inserts: ['t1'] } } }],
    });

    expect(onBatch).toHaveBeenCalledTimes(1);
    expect(onBatch.mock.calls[0][0].rows.ticket.inserts.t1.title).toBe('hello');
  });

  it('handle.unsubscribe() closes the EventSource', async () => {
    let fake: FakeEventSource | undefined;
    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: (url) => {
        fake = createFakeEventSource(url);
        return fake.source;
      },
    });

    const pending = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch: vi.fn() },
    });

    fake!.emit({ type: 'subscription:ready', subscriptionId: 'sub-1' });
    const handle = await pending;

    expect(fake!.source.closed).toBe(false);
    await handle.unsubscribe();
    expect(fake!.source.closed).toBe(true);
  });

  it('subscribe() rejects when the server emits subscription:error before ready', async () => {
    let fake: FakeEventSource | undefined;
    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: (url) => {
        fake = createFakeEventSource(url);
        return fake.source;
      },
    });

    const pending = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch: vi.fn() },
    });

    fake!.emit({ type: 'subscription:error', error: { message: 'not allowed' } });

    await expect(pending).rejects.toMatchObject({ message: 'not allowed' });
    expect(fake!.source.closed).toBe(true);
  });

  it('subscribe() rejects when the EventSource errors before ready', async () => {
    let fake: FakeEventSource | undefined;
    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: (url) => {
        fake = createFakeEventSource(url);
        return fake.source;
      },
    });

    const pending = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch: vi.fn() },
    });

    fake!.emitError();

    await expect(pending).rejects.toBeInstanceOf(Error);
  });

  it('subscription:error after ready is surfaced via listener.onError', async () => {
    let fake: FakeEventSource | undefined;
    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: (url) => {
        fake = createFakeEventSource(url);
        return fake.source;
      },
    });

    const onError = vi.fn();
    const pending = transport.subscribe({
      name: 'ticketSubscription',
      args: { ticketId: 't1' },
      listener: { onBatch: vi.fn(), onError },
    });

    fake!.emit({ type: 'subscription:ready', subscriptionId: 'sub-1' });
    await pending;

    fake!.emit({ type: 'subscription:error', error: { message: 'downstream fault' } });

    expect(onError).toHaveBeenCalledWith({ message: 'downstream fault' });
  });

  it('connect() and disconnect() are no-ops (transport is always "connected")', async () => {
    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: () => createFakeEventSource('/events').source,
    });

    expect(transport.isConnected()).toBe(true);
    await expect(transport.connect()).resolves.toBeUndefined();
    await expect(transport.disconnect()).resolves.toBeUndefined();
    expect(transport.isConnected()).toBe(true);
  });

  it('each subscribe() opens its own EventSource', async () => {
    const fakes: FakeEventSource[] = [];

    const transport = new SseTransport({
      eventsUrl: '/events',
      eventSource: (url) => {
        const fake = createFakeEventSource(url);
        fakes.push(fake);
        return fake.source;
      },
    });

    const p1 = transport.subscribe({ name: 'ticketSubscription', args: { ticketId: 't1' }, listener: { onBatch: vi.fn() } });
    const p2 = transport.subscribe({ name: 'ticketSubscription', args: { ticketId: 't2' }, listener: { onBatch: vi.fn() } });

    expect(fakes).toHaveLength(2);
    fakes[0]!.emit({ type: 'subscription:ready', subscriptionId: 'sub-1' });
    fakes[1]!.emit({ type: 'subscription:ready', subscriptionId: 'sub-2' });

    const [h1, h2] = await Promise.all([p1, p2]);
    expect(h1.subscriptionId).toBe('sub-1');
    expect(h2.subscriptionId).toBe('sub-2');
  });
});
