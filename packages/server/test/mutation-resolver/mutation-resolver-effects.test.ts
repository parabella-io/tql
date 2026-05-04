import { describe, test, expect, vi } from 'vitest';
import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import { SchemaEntity } from '../../src/schema-entity.js';
import { MutationResolver } from '../../src/mutation/mutation-resolver.js';
import { InMemoryEffectQueue } from '../../src/effects/in-memory-effect-queue.js';

type Thing = SchemaEntity<{ name: string }>;

type Entities = {
  thing: Thing;
};

type Context = {
  userId: string;
  isAllowed: boolean;
};

type Fixture = {
  resolver: MutationResolver<any>;
  resolveEffects: ReturnType<typeof vi.fn>;
};

function buildFixture(): Fixture {
  const schema = new Schema<Context, Entities>();
  const resolveEffects = vi.fn(async () => {});

  schema.mutation('createThing', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({
      thing: z.object({ id: z.string(), name: z.string() }),
    }),
    allow: ({ context }) => context.isAllowed,
    resolve: async ({ input }) => {
      return {
        thing: { id: input.id, name: input.name },
      };
    },
    resolveEffects,
  });

  schema.mutation('createThingNoChanges', {
    input: z.object({ id: z.string() }),
    output: z.object({}),
    allow: () => true,
    resolve: async () => ({}),
    resolveEffects,
  });

  const resolver = new MutationResolver<any>({ schema: schema as any });

  return { resolver, resolveEffects };
}

describe('MutationResolver - resolveEffects', () => {
  test('returns a pending effect with typed output after successful resolve', async () => {
    const { resolver, resolveEffects } = buildFixture();

    const context: Context = { userId: 'u1', isAllowed: true };

    const { results, effects } = await resolver.handle({
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(results.createThing.error).toBeNull();
    expect(effects).toHaveLength(1);
    expect(effects[0]!.mutationName).toBe('createThing');
    expect(resolveEffects).not.toHaveBeenCalled();

    await effects[0]!.run();

    expect(resolveEffects).toHaveBeenCalledTimes(1);
    expect(resolveEffects).toHaveBeenCalledWith({
      context,
      input: { id: 't1', name: 'first' },
      output: {
        thing: { id: 't1', name: 'first' },
      },
    });
  });

  test('returns a pending effect even when mutation returns an empty output', async () => {
    const { resolver, resolveEffects } = buildFixture();

    const context: Context = { userId: 'u1', isAllowed: true };

    const { effects } = await resolver.handle({
      context,
      mutation: {
        createThingNoChanges: { input: { id: 't1' } },
      },
    });

    expect(effects).toHaveLength(1);
    expect(effects[0]!.mutationName).toBe('createThingNoChanges');

    await effects[0]!.run();

    expect(resolveEffects).toHaveBeenCalledTimes(1);
    expect(resolveEffects).toHaveBeenCalledWith({
      context,
      input: { id: 't1' },
      output: {},
    });
  });

  test('does not return an effect when allow returns false', async () => {
    const { resolver, resolveEffects } = buildFixture();

    const context: Context = { userId: 'u1', isAllowed: false };

    const { results, effects } = await resolver.handle({
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(results.createThing.error).not.toBeNull();
    expect(effects).toHaveLength(0);
    expect(resolveEffects).not.toHaveBeenCalled();
  });

  test('does not return an effect when input validation fails', async () => {
    const { resolver, resolveEffects } = buildFixture();

    const context: Context = { userId: 'u1', isAllowed: true };

    const { results, effects } = await resolver.handle({
      context,
      mutation: {
        createThing: { input: { id: 't1' } as any },
      },
    });

    expect(results.createThing.error).not.toBeNull();
    expect(effects).toHaveLength(0);
    expect(resolveEffects).not.toHaveBeenCalled();
  });

  test('returns one effect per mutation in a batch', async () => {
    const { resolver, resolveEffects } = buildFixture();

    const context: Context = { userId: 'u1', isAllowed: true };

    const { effects } = await resolver.handle({
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
        createThingNoChanges: { input: { id: 't2' } },
      },
    });

    expect(effects.map((e) => e.mutationName).sort()).toEqual(['createThing', 'createThingNoChanges'].sort());

    expect(resolveEffects).not.toHaveBeenCalled();
  });
});

describe('InMemoryEffectQueue', () => {
  test('drain waits until enqueued tasks finish', async () => {
    const queue = new InMemoryEffectQueue();

    let resolved = false;

    queue.enqueue(
      async () => {
        await new Promise((r) => setTimeout(r, 10));
        resolved = true;
      },
      { mutationName: 'x' },
    );

    await queue.drain();

    expect(resolved).toBe(true);
  });

  test('routes task errors to onError without throwing', async () => {
    const onError = vi.fn();
    const queue = new InMemoryEffectQueue({ onError });

    queue.enqueue(
      async () => {
        throw new Error('boom');
      },
      { mutationName: 'x' },
    );

    await queue.drain();

    expect(onError).toHaveBeenCalledTimes(1);
    const [err, meta] = onError.mock.calls[0]!;
    expect((err as Error).message).toBe('boom');
    expect(meta).toEqual({ mutationName: 'x' });
  });

  test('falls back to logger.error when no onError is supplied', async () => {
    const logger = { error: vi.fn() };
    const queue = new InMemoryEffectQueue({ logger });

    queue.enqueue(
      async () => {
        throw new Error('boom');
      },
      { mutationName: 'x' },
    );

    await queue.drain();

    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
