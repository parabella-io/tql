import { describe, expect, test, vi } from 'vitest';

import { InMemoryBackbone } from '../../src/backbone/in-memory-backbone.js';

describe('InMemoryBackbone', () => {
  test('delivers published messages to every subscriber', async () => {
    const backbone = new InMemoryBackbone();

    const a = vi.fn();
    const b = vi.fn();

    backbone.subscribe(a);
    backbone.subscribe(b);

    await backbone.publish({ mutationName: 'createThing', changes: { thing: { inserts: [{ id: 't1' }] } } });

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    expect(a).toHaveBeenCalledWith({
      mutationName: 'createThing',
      changes: { thing: { inserts: [{ id: 't1' }] } },
    });
  });

  test('returned unsubscribe stops future delivery', async () => {
    const backbone = new InMemoryBackbone();

    const listener = vi.fn();
    const unsubscribe = backbone.subscribe(listener);

    unsubscribe();

    await backbone.publish({ mutationName: 'x', changes: {} });

    expect(listener).not.toHaveBeenCalled();
  });

  test('swallows listener errors and continues delivering to others', async () => {
    const logger = { error: vi.fn() };
    const backbone = new InMemoryBackbone({ logger });

    const working = vi.fn();

    backbone.subscribe(async () => {
      throw new Error('boom');
    });
    backbone.subscribe(working);

    await backbone.publish({ mutationName: 'createThing', changes: {} });

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(working).toHaveBeenCalledTimes(1);
  });

  test('routes listener errors to onError when provided', async () => {
    const onError = vi.fn();
    const backbone = new InMemoryBackbone({ onError });

    backbone.subscribe(() => {
      throw new Error('kaboom');
    });

    await backbone.publish({ mutationName: 'createThing', changes: {} });

    expect(onError).toHaveBeenCalledTimes(1);
    const [err, message] = onError.mock.calls[0]!;
    expect((err as Error).message).toBe('kaboom');
    expect(message).toEqual({ mutationName: 'createThing', changes: {} });
  });
});
