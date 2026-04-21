import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createQueryStore, Query } from '../../src';
import type { QueryStore } from '../../src/core/query/query-store';
import { QueryUpdateHooksMap } from '../../src/core/query/query.types';
import {
  createSubscriptionStore,
  Subscription,
  SubscriptionRuntime,
  SubscriptionStore,
} from '../../src/core/subscription';
import {
  SubscribeHandle,
  SubscriberBatchMessage,
  SubscriptionListener,
  SubscriptionTransport,
} from '../../src/core/transports';

type FakeSubscribeCall = {
  name: string;
  args: unknown;
  listener: SubscriptionListener;
  handle: SubscribeHandle;
  unsubscribe: ReturnType<typeof vi.fn>;
};

/** Minimal fake SubscriptionTransport that captures subscribe/unsubscribe
 *  calls and lets the test drive batches into each listener. */
const createFakeTransport = () => {
  let nextId = 0;

  const calls: FakeSubscribeCall[] = [];

  let connected = false;

  const transport: SubscriptionTransport = {
    async connect() {
      connected = true;
    },
    async disconnect() {
      connected = false;
    },
    isConnected() {
      return connected;
    },
    async subscribe({ name, args, listener }) {
      if (!connected) throw new Error('not connected');
      const subscriptionId = `sub-${++nextId}`;
      const unsubscribe = vi.fn(async () => {
        const index = calls.findIndex((c) => c.handle.subscriptionId === subscriptionId);
        if (index >= 0) calls.splice(index, 1);
      });
      const handle: SubscribeHandle = { subscriptionId, unsubscribe };
      calls.push({ name, args, listener, handle, unsubscribe });
      return handle;
    },
  };

  return {
    transport,
    calls,
    deliverBatch: (subscriptionId: string, batch: SubscriberBatchMessage) => {
      const call = calls.find((c) => c.handle.subscriptionId === subscriptionId);
      if (!call) throw new Error(`no subscription ${subscriptionId}`);
      call.listener.onBatch(batch);
    },
    deliverError: (subscriptionId: string, error: { message: string }) => {
      const call = calls.find((c) => c.handle.subscriptionId === subscriptionId);
      if (!call) throw new Error(`no subscription ${subscriptionId}`);
      call.listener.onError?.(error);
    },
  };
};

const buildRuntime = (options: {
  queryStore: QueryStore;
  queryUpdateHooks: QueryUpdateHooksMap;
  subscriptionStore: SubscriptionStore;
  transport: SubscriptionTransport;
}): SubscriptionRuntime => {
  const activeSet: Set<{ unsubscribe: () => Promise<void> }> = new Set();

  return {
    queryStore: options.queryStore,
    queryUpdateHooks: options.queryUpdateHooks,
    subscriptionStore: options.subscriptionStore,
    getTransport: () => options.transport,
    ensureConnected: async () => {
      if (!options.transport.isConnected()) await options.transport.connect();
    },
    registerActive: (entry) => {
      activeSet.add(entry);
    },
    unregisterActive: (entry) => {
      activeSet.delete(entry);
    },
  };
};

describe('Subscription', () => {
  let queryStore: QueryStore;
  let queryUpdateHooks: QueryUpdateHooksMap;
  let subscriptionStore: SubscriptionStore;

  beforeEach(() => {
    queryStore = createQueryStore();
    queryUpdateHooks = {};
    subscriptionStore = createSubscriptionStore();
  });

  it('subscribe() flips the store into `active` and wires the server subscriptionId', async () => {
    const fake = createFakeTransport();
    await fake.transport.connect();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
      },
    });

    const result = await subscription.subscribe({ ticketId: 't1' });

    expect(result.subscriptionId).toBe('sub-1');

    const state = subscription.getState({ ticketId: 't1' });
    expect(state.status).toBe('active');
    expect(state.subscriptionId).toBe('sub-1');
    expect(state.args).toEqual({ ticketId: 't1' });
  });

  it('subscribe() lazily connects the transport when it is not already open', async () => {
    const fake = createFakeTransport();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
      },
    });

    expect(fake.transport.isConnected()).toBe(false);

    const result = await subscription.subscribe({ ticketId: 't1' });

    expect(fake.transport.isConnected()).toBe(true);
    expect(result.subscriptionId).toBe('sub-1');
  });

  it('subscribe() is idempotent per params — the same server subscriptionId is returned', async () => {
    const fake = createFakeTransport();
    await fake.transport.connect();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
      },
    });

    const first = await subscription.subscribe({ ticketId: 't1' });
    const second = await subscription.subscribe({ ticketId: 't1' });

    expect(first.subscriptionId).toBe(second.subscriptionId);
    expect(fake.calls).toHaveLength(1);
  });

  it('incoming `subscription:batch` invokes per-entity onChange hooks with the `store` helper', async () => {
    const fake = createFakeTransport();
    await fake.transport.connect();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    const onInsert = vi.fn();
    const onDelete = vi.fn();

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
        onChange: {
          ticket: {
            onInsert,
            onDelete,
          },
        },
      },
    });

    await subscription.subscribe({ ticketId: 't1' });

    fake.deliverBatch('sub-1', {
      type: 'subscription:batch',
      rows: {
        ticket: {
          inserts: { t1: { id: 't1', title: 'hello', workspaceId: 'w1' } },
        },
      },
      matches: [
        {
          id: 'sub-1',
          name: 'ticketSubscription',
          changes: { ticket: { inserts: ['t1'] } },
        },
      ],
    });

    expect(onInsert).toHaveBeenCalledTimes(1);
    expect(onInsert.mock.calls[0][0].args).toEqual({ ticketId: 't1' });
    expect(onInsert.mock.calls[0][0].change).toMatchObject({ id: 't1', title: 'hello' });
    expect(onInsert.mock.calls[0][0].store).toBeTruthy();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('incoming batch feeds registered query updateOnChange hooks', async () => {
    const fake = createFakeTransport();
    await fake.transport.connect();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    // Register a query that lives in the store so the shared helper has
    // something to update.
    const ticketsQuery = new Query<any, any, any, any>({
      store: queryStore,
      queryHandler: vi.fn().mockResolvedValue({
        tickets: { data: [{ id: 't1', title: 'before', workspaceId: 'w1' }], error: null, metadata: {} },
      }),
      queryName: 'tickets',
      queryUpdateHooks,
      queryOptions: {
        queryKey: 'tickets',
        query: () => ({ query: {}, select: true }),
      },
    });

    ticketsQuery.updateOnChange('ticket' as never, {
      onUpdate: ({ draft, change }) => {
        if (!Array.isArray(draft)) return draft;
        return draft.map((t: any) => (t.id === (change as any).id ? { ...t, ...(change as any) } : t));
      },
    } as never);

    await ticketsQuery.execute({});

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
      },
    });

    await subscription.subscribe({ ticketId: 't1' });

    fake.deliverBatch('sub-1', {
      type: 'subscription:batch',
      rows: {
        ticket: {
          updates: { t1: { id: 't1', title: 'after', workspaceId: 'w1' } },
        },
      },
      matches: [
        {
          id: 'sub-1',
          name: 'ticketSubscription',
          changes: { ticket: { updates: ['t1'] } },
        },
      ],
    });

    const data = ticketsQuery.getData({}) as Array<{ id: string; title: string }>;
    expect(data[0]).toMatchObject({ id: 't1', title: 'after' });
  });

  it('onError from the transport flips the subscription state to `error`', async () => {
    const fake = createFakeTransport();
    await fake.transport.connect();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
      },
    });

    await subscription.subscribe({ ticketId: 't1' });

    fake.deliverError('sub-1', { message: 'boom' });

    const state = subscription.getState({ ticketId: 't1' });
    expect(state.status).toBe('error');
    expect(state.error).toBeTruthy();
  });

  it('unsubscribe() tells the transport and flips the state to `closed`', async () => {
    const fake = createFakeTransport();
    await fake.transport.connect();

    const runtime = buildRuntime({ queryStore, queryUpdateHooks, subscriptionStore, transport: fake.transport });

    const subscription = new Subscription<any, any, { ticketId: string }>({
      runtime,
      subscriptionName: 'ticketSubscription',
      subscriptionOptions: {
        subscriptionKey: 'ticketSubscription',
        args: (params) => ({ ticketId: params.ticketId }),
      },
    });

    await subscription.subscribe({ ticketId: 't1' });

    const unsubscribeSpy = fake.calls[0]!.unsubscribe;

    await subscription.unsubscribe({ ticketId: 't1' });

    expect(unsubscribeSpy).toHaveBeenCalled();
    const state = subscription.getStateOrNull({ ticketId: 't1' });
    expect(state?.status).toBe('closed');
    expect(state?.subscriptionId).toBeNull();
  });
});
