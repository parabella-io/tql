import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { SubscriptionResolver } from '../../src/subscription/subscription-resolver.js';

type Ticket = SchemaEntity<{ title: string; workspaceId: string }>;

type Entities = {
  ticket: Ticket;
};

type Context = {
  userId: string;
  canSubscribe: boolean;
};

type Connection = {
  connectionId: string;
  workspaceIds: string[];
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
      if (change.operation !== 'insert' && change.operation !== 'update') return null;
      return change.row.id;
    },
    filter: async ({ connection, change }) => {
      if (change.entity !== 'ticket') return false;
      if (change.operation !== 'insert' && change.operation !== 'update') return false;
      return connection.workspaceIds.includes(change.row.workspaceId as string);
    },
  });

  schema.subscription('workspaceTicketsSubscription', {
    args: z.object({ workspaceId: z.string() }),
    subscribeTo: { ticket: true },
    keyFromSubscribe: ({ args }) => args.workspaceId,
    keyFromChange: ({ change }) => {
      if (change.entity !== 'ticket') return null;
      return (change.row as { workspaceId?: string }).workspaceId ?? null;
    },
  });

  return schema;
};

describe('SubscriptionResolver.subscribe', () => {
  test('rejects unknown subscription names', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const result = await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'doesNotExist',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send: vi.fn(),
    });

    expect(result.ok).toBe(false);
  });

  test('rejects invalid args against the zod schema', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const result = await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 42 },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: [] },
      send: vi.fn(),
    });

    expect(result.ok).toBe(false);
  });

  test('rejects when allow returns falsy', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const result = await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: false },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send: vi.fn(),
    });

    expect(result.ok).toBe(false);
  });

  test('accepts valid subscribe payloads and registers the subscriber', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const result = await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send: vi.fn(),
    });

    expect(result.ok).toBe(true);
    expect(resolver.getRegistry().size()).toBe(1);
  });
});

describe('SubscriptionResolver.dispatch', () => {
  test('short-circuits when no subscribed entities overlap', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const send = vi.fn();

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send,
    });

    await resolver.dispatch({ mutationName: 'x', changes: { other: { inserts: [{ id: 'o1' }] } } });

    expect(send).not.toHaveBeenCalled();
  });

  test('routes matching changes to the subscriber with correct key', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const send = vi.fn();

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send,
    });

    await resolver.dispatch({
      mutationName: 'createTicket',
      changes: { ticket: { inserts: [{ id: 't1', title: 'hello', workspaceId: 'w1' }] } },
    });

    expect(send).toHaveBeenCalledTimes(1);
    const [message] = send.mock.calls[0]!;
    expect(message.type).toBe('subscription:batch');
    expect(message.rows.ticket.inserts.t1).toMatchObject({ id: 't1', title: 'hello', workspaceId: 'w1' });
    expect(message.matches).toHaveLength(1);
    expect(message.matches[0].name).toBe('ticketSubscription');
    expect(message.matches[0].changes.ticket.inserts).toEqual(['t1']);
  });

  test('skips subscribers whose filter returns false', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const send = vi.fn();

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w2'] },
      send,
    });

    await resolver.dispatch({
      mutationName: 'createTicket',
      changes: { ticket: { inserts: [{ id: 't1', title: 'hello', workspaceId: 'w1' }] } },
    });

    expect(send).not.toHaveBeenCalled();
  });

  test('skips subscribers whose key does not match', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const send = vi.fn();

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 'SOME_OTHER_ID' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send,
    });

    await resolver.dispatch({
      mutationName: 'createTicket',
      changes: { ticket: { inserts: [{ id: 't1', title: 'hello', workspaceId: 'w1' }] } },
    });

    expect(send).not.toHaveBeenCalled();
  });

  test('unsubscribe removes the subscriber from future dispatches', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const send = vi.fn();

    const result = await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send,
    });

    if (!result.ok) throw new Error('subscribe should have succeeded');
    result.unsubscribe();

    await resolver.dispatch({
      mutationName: 'createTicket',
      changes: { ticket: { inserts: [{ id: 't1', title: 'hello', workspaceId: 'w1' }] } },
    });

    expect(send).not.toHaveBeenCalled();
    expect(resolver.getRegistry().size()).toBe(0);
  });

  test('coalesces multiple subscriptions on one connection into a single batch with deduplicated rows', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const send = vi.fn();

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send,
    });

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'workspaceTicketsSubscription',
      args: { workspaceId: 'w1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send,
    });

    await resolver.dispatch({
      mutationName: 'createTicket',
      changes: { ticket: { inserts: [{ id: 't1', title: 'hello', workspaceId: 'w1' }] } },
    });

    expect(send).toHaveBeenCalledTimes(1);

    const [message] = send.mock.calls[0]!;
    expect(message.type).toBe('subscription:batch');

    // Shared row table: the single ticket row appears exactly once.
    expect(Object.keys(message.rows.ticket.inserts)).toEqual(['t1']);
    expect(message.rows.ticket.inserts.t1).toMatchObject({ id: 't1', title: 'hello', workspaceId: 'w1' });

    // Two match entries, both referencing the same row id.
    expect(message.matches).toHaveLength(2);
    const matchNames = message.matches.map((m: { name: string }) => m.name).sort();
    expect(matchNames).toEqual(['ticketSubscription', 'workspaceTicketsSubscription']);
    for (const match of message.matches) {
      expect(match.changes.ticket.inserts).toEqual(['t1']);
    }
  });

  test('delivers separate batches to separate connections', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    const sendA = vi.fn();
    const sendB = vi.fn();

    await resolver.subscribe({
      connectionId: 'cA',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'cA', workspaceIds: ['w1'] },
      send: sendA,
    });

    await resolver.subscribe({
      connectionId: 'cB',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u2', canSubscribe: true },
      connection: { connectionId: 'cB', workspaceIds: ['w1'] },
      send: sendB,
    });

    await resolver.dispatch({
      mutationName: 'createTicket',
      changes: { ticket: { inserts: [{ id: 't1', title: 'hello', workspaceId: 'w1' }] } },
    });

    expect(sendA).toHaveBeenCalledTimes(1);
    expect(sendB).toHaveBeenCalledTimes(1);
  });

  test('removeConnection drops every subscriber on that connection', async () => {
    const resolver = new SubscriptionResolver({ schema: buildSchema() });

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't1' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send: vi.fn(),
    });

    await resolver.subscribe({
      connectionId: 'c1',
      subscriptionName: 'ticketSubscription',
      args: { ticketId: 't2' },
      context: { userId: 'u1', canSubscribe: true },
      connection: { connectionId: 'c1', workspaceIds: ['w1'] },
      send: vi.fn(),
    });

    resolver.removeConnection('c1');

    expect(resolver.getRegistry().size()).toBe(0);
  });
});
