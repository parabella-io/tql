import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { MutationResolver } from '../../src/mutation/mutation-resolver.js';
import { effectsPlugin, InMemoryEffectQueue } from '../../src/plugins/built-in/effects/index.js';
import { PluginRunner } from '../../src/plugins/runner.js';
import { buildMutationPlan } from '../../src/request-plan/index.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';

type Thing = SchemaEntity<{ name: string }>;

type Entities = {
  thing: Thing;
};

type Context = {
  userId: string;
  isAllowed: boolean;
};

type Fixture = {
  schema: Schema<Context, Entities>;
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

  return { schema, resolver, resolveEffects };
}

async function runMutationEffects(options: {
  fixture: Fixture;
  context: Context;
  mutation: Record<string, unknown>;
  flush?: boolean;
}) {
  const effects = effectsPlugin();
  const runner = new PluginRunner({ plugins: [effects] });
  const ctx = await runner.createContext({
    request: {},
    body: options.mutation,
    schemaContext: options.context,
    signal: new AbortController().signal,
  });
  const plan = buildMutationPlan({ schema: options.fixture.schema as any, mutation: options.mutation as any });
  const { results, inputs } = await options.fixture.resolver.handle({
    context: options.context,
    mutation: options.mutation as any,
  });

  await runner.afterMutation({
    ctx,
    plan,
    result: results as Record<string, { data: unknown; error: unknown }>,
    inputs,
    costs: {},
  });

  if (options.flush ?? true) {
    await runner.afterResponse({ ctx });
  }

  await effects.drain();

  return { results };
}

describe('effectsPlugin - resolveEffects', () => {
  test('enqueues an effect with typed input and output after a successful mutation', async () => {
    const fixture = buildFixture();
    const context: Context = { userId: 'u1', isAllowed: true };

    const { results } = await runMutationEffects({
      fixture,
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(results.createThing.error).toBeNull();
    expect(fixture.resolveEffects).toHaveBeenCalledTimes(1);
    expect(fixture.resolveEffects).toHaveBeenCalledWith({
      context,
      input: { id: 't1', name: 'first' },
      output: {
        thing: { id: 't1', name: 'first' },
      },
    });
  });

  test('enqueues an effect when mutation output is empty', async () => {
    const fixture = buildFixture();
    const context: Context = { userId: 'u1', isAllowed: true };

    await runMutationEffects({
      fixture,
      context,
      mutation: {
        createThingNoChanges: { input: { id: 't1' } },
      },
    });

    expect(fixture.resolveEffects).toHaveBeenCalledTimes(1);
    expect(fixture.resolveEffects).toHaveBeenCalledWith({
      context,
      input: { id: 't1' },
      output: {},
    });
  });

  test('does not enqueue effects before afterResponse runs', async () => {
    const fixture = buildFixture();
    const context: Context = { userId: 'u1', isAllowed: true };

    await runMutationEffects({
      fixture,
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
      },
      flush: false,
    });

    expect(fixture.resolveEffects).not.toHaveBeenCalled();
  });

  test('does not enqueue an effect when allow returns false', async () => {
    const fixture = buildFixture();
    const context: Context = { userId: 'u1', isAllowed: false };

    const { results } = await runMutationEffects({
      fixture,
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(results.createThing.error).not.toBeNull();
    expect(fixture.resolveEffects).not.toHaveBeenCalled();
  });

  test('does not enqueue an effect when input validation fails', async () => {
    const fixture = buildFixture();
    const context: Context = { userId: 'u1', isAllowed: true };

    const { results } = await runMutationEffects({
      fixture,
      context,
      mutation: {
        createThing: { input: { id: 't1' } },
      },
    });

    expect(results.createThing.error).not.toBeNull();
    expect(fixture.resolveEffects).not.toHaveBeenCalled();
  });

  test('enqueues one effect per successful mutation in a batch', async () => {
    const fixture = buildFixture();
    const context: Context = { userId: 'u1', isAllowed: true };

    await runMutationEffects({
      fixture,
      context,
      mutation: {
        createThing: { input: { id: 't1', name: 'first' } },
        createThingNoChanges: { input: { id: 't2' } },
      },
    });

    expect(fixture.resolveEffects).toHaveBeenCalledTimes(2);
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
