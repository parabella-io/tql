import type { SchemaContextExtensions } from '../../extensions.js';
import { definePlugin, type ServerPlugin } from '../../plugin.js';
import { InMemoryEffectQueue, type EffectLogger } from './in-memory-queue.js';
import type { PendingMutationEffect } from './pending-effect.js';
import type { EffectMeta, EffectQueue } from './queue.js';

export type ResolveMutationEffect<Input = unknown, Output = unknown, SchemaContext = unknown> = (options: {
  input: Input;
  context: SchemaContext & SchemaContextExtensions;
  output: Output;
}) => Promise<void> | void;

export type EffectsPluginOptions = {
  queue?: EffectQueue;
  concurrency?: number;
  logger?: EffectLogger;
  onError?: (error: unknown, meta: EffectMeta) => void;
};

export type EffectsPlugin = ServerPlugin & {
  drain(): Promise<void>;
};

export type EffectsPluginContext = {
  pendingMutationEffects?: PendingMutationEffect[];
};

export const effectsPlugin = (options: EffectsPluginOptions = {}): EffectsPlugin => {
  const queue =
    options.queue ??
    new InMemoryEffectQueue({
      concurrency: options.concurrency,
      logger: options.logger,
      onError: options.onError,
    });

  const plugin = definePlugin({
    name: 'effects',
    setup({ server }) {
      if ('setLogger' in queue && typeof queue.setLogger === 'function') {
        queue.setLogger(server.log);
      }
    },
    afterMutation({ ctx, plan, result, inputs }) {
      const effects: PendingMutationEffect[] = [];

      for (const entry of plan.entries) {
        const mutationResult = result[entry.mutationName];

        if (!mutationResult || mutationResult.error || !(entry.mutationName in inputs)) {
          continue;
        }

        const resolveEffects = getResolveEffects(entry.extensions);

        if (!resolveEffects) {
          continue;
        }

        effects.push({
          mutationName: entry.mutationName,
          run: async () => {
            await resolveEffects({
              context: ctx.schemaContext as SchemaContextExtensions,
              input: inputs[entry.mutationName],
              output: mutationResult.data,
            });
          },
        });
      }

      (ctx.plugin as EffectsPluginContext).pendingMutationEffects = effects;
    },
    afterResponse({ ctx }) {
      const pending = (ctx.plugin as EffectsPluginContext).pendingMutationEffects ?? [];

      for (const effect of pending) {
        queue.enqueue(() => effect.run(), { mutationName: effect.mutationName });
      }
    },
  });

  return Object.assign(plugin, {
    drain: () => queue.drain(),
  });
};

const getResolveEffects = (extensions: unknown): ResolveMutationEffect | undefined =>
  (extensions as { resolveEffects?: ResolveMutationEffect }).resolveEffects;
