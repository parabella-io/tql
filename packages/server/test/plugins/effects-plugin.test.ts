import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { MutationResolver } from '../../src/mutation/mutation-resolver.js';
import { effectsPlugin, InMemoryEffectQueue } from '../../src/plugins/built-in/effects/index.js';
import { PluginRunner } from '../../src/plugins/runner.js';
import { buildMutationPlan } from '../../src/request-plan/index.js';
import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';
import { Server } from '../../src/server/server.js';
import { createFakeTransport } from '../harness/http-fake.js';

// ─── shared types for effectsPlugin - resolveEffects ───────────────────────

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

async function runMutationEffects(options: { fixture: Fixture; context: Context; mutation: Record<string, unknown>; flush?: boolean }) {
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

// ─── shared types for Server - effects lifecycle ───────────────────────────

type EffectThing = SchemaEntity<{ name: string }>;
type EffectSchemaEntities = { effectThing: EffectThing };
type EffectSchemaContext = { userId: string };
type EffectSchema = {
  SchemaEntities: EffectSchemaEntities;
  QueryInputMap: Record<string, any>;
  QueryResponseMap: Record<string, any>;
  QueryRegistry: Record<string, any>;
  MutationInputMap: Record<string, any>;
  MutationResponseMap: Record<string, any>;
  MutationOutputMap: Record<string, any>;
};

type EffectServerFixture = {
  resolveEffects: ReturnType<typeof vi.fn>;
  effects: ReturnType<typeof effectsPlugin>;
  transport: ReturnType<typeof createFakeTransport>;
};

function buildEffectServerFixture(options?: {
  allow?: () => boolean;
  resolveEffects?: () => Promise<void>;
  onError?: ReturnType<typeof vi.fn>;
}): EffectServerFixture {
  const schema = new Schema<EffectSchemaContext, EffectSchemaEntities>();
  const resolveEffects = vi.fn(options?.resolveEffects ?? (async () => {}));
  const effects = effectsPlugin(options?.onError ? { onError: options.onError } : undefined);

  schema.mutation('createEffectThing', {
    input: z.object({ id: z.string(), name: z.string() }),
    output: z.object({
      effectThing: z.object({ id: z.string(), name: z.string() }),
    }),
    allow: options?.allow ?? (() => true),
    resolve: async ({ input }) => ({
      effectThing: { id: input.id, name: input.name },
    }),
    resolveEffects,
  });

  const transport = createFakeTransport();

  const server = new Server<EffectSchema>({
    schema: schema as any,
    createContext: async () => ({ userId: 'u1' }),
    generateSchema: { enabled: false },
    plugins: [effects],
  });

  server.attachHttp(transport.adapter);

  return { resolveEffects, effects, transport };
}

// ─── tests ─────────────────────────────────────────────────────────────────

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

describe('Server - effects lifecycle', () => {
  test('enqueues mutation effects only after afterResponse hook fires', async () => {
    const { resolveEffects, effects, transport } = buildEffectServerFixture();

    const { response, flushResponse } = await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(response).toMatchObject({
      createEffectThing: {
        data: { effectThing: { id: 't1', name: 'first' } },
        error: null,
      },
    });

    expect(resolveEffects).not.toHaveBeenCalled();

    await flushResponse();
    await effects.drain();

    expect(resolveEffects).toHaveBeenCalledTimes(1);

    expect(resolveEffects).toHaveBeenCalledWith({
      context: { userId: 'u1' },
      input: { id: 't1', name: 'first' },
      output: { effectThing: { id: 't1', name: 'first' } },
    });
  });

  test('does not enqueue mutation effects until the response is flushed', async () => {
    const { resolveEffects, effects, transport } = buildEffectServerFixture();

    await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    await effects.drain();

    expect(resolveEffects).not.toHaveBeenCalled();
  });

  test('does not enqueue effects when mutation fails', async () => {
    const { resolveEffects, effects, transport } = buildEffectServerFixture({ allow: () => false });

    const { flushResponse } = await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    await flushResponse();
    await effects.drain();

    expect(resolveEffects).not.toHaveBeenCalled();
  });

  test('effect failures are isolated from the HTTP response and routed to onError', async () => {
    const boom = new Error('effect failed');
    const onError = vi.fn();

    const { effects, transport } = buildEffectServerFixture({
      resolveEffects: async () => {
        throw boom;
      },
      onError,
    });

    const { response, flushResponse } = await transport.invoke('/mutation', {
      body: {
        createEffectThing: { input: { id: 't1', name: 'first' } },
      },
    });

    expect(response).toMatchObject({
      createEffectThing: { error: null },
    });

    await flushResponse();
    await effects.drain();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]![0]).toBe(boom);
    expect(onError.mock.calls[0]![1]).toEqual({ mutationName: 'createEffectThing' });
  });
});
