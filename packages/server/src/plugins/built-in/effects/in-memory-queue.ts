import PQueue from 'p-queue';

import type { EffectMeta, EffectQueue, EffectTask } from './queue.js';

export type EffectLogger = {
  error: (...args: unknown[]) => void;
};

export type InMemoryEffectQueueOptions = {
  concurrency?: number;
  onError?: (error: unknown, meta: EffectMeta) => void;
  logger?: EffectLogger;
};

export class InMemoryEffectQueue implements EffectQueue {
  private readonly queue: PQueue;

  private readonly onError?: (error: unknown, meta: EffectMeta) => void;

  private logger?: EffectLogger;

  constructor(options: InMemoryEffectQueueOptions = {}) {
    this.queue = new PQueue({
      concurrency: options.concurrency ?? Number.POSITIVE_INFINITY,
    });

    this.onError = options.onError;

    this.logger = options.logger;
  }

  setLogger(logger: EffectLogger): void {
    this.logger ??= logger;
  }

  enqueue(task: EffectTask, meta: EffectMeta): void {
    this.queue.add(async () => {
      try {
        await task();
      } catch (error) {
        if (this.onError) {
          try {
            this.onError(error, meta);
          } catch (handlerError) {
            this.logger?.error({ err: handlerError, meta }, '[tql] effect onError handler threw');
          }
          return;
        }

        this.logger?.error({ err: error, meta }, `[tql] mutation effect failed: ${meta.mutationName}`);
      }
    });
  }

  async drain(): Promise<void> {
    await this.queue.onIdle();
  }
}
