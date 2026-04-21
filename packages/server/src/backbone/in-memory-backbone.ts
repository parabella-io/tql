import type { Backbone, BackboneListener, BackboneMessage } from './backbone.js';

export type InMemoryBackboneLogger = {
  error: (...args: unknown[]) => void;
};

export type InMemoryBackboneOptions = {
  logger?: InMemoryBackboneLogger;
  onError?: (error: unknown, message: BackboneMessage) => void;
};

export class InMemoryBackbone implements Backbone {
  private readonly listeners: Set<BackboneListener> = new Set();

  private readonly logger?: InMemoryBackboneLogger;

  private readonly onError?: (error: unknown, message: BackboneMessage) => void;

  constructor(options: InMemoryBackboneOptions = {}) {
    this.logger = options.logger;

    this.onError = options.onError;
  }

  async publish(message: BackboneMessage): Promise<void> {
    const snapshot = Array.from(this.listeners);

    for (const listener of snapshot) {
      try {
        await listener(message);
      } catch (error) {
        if (this.onError) {
          try {
            this.onError(error, message);
          } catch (handlerError) {
            this.logger?.error({ err: handlerError, message }, '[tql] backbone onError handler threw');
          }
          continue;
        }

        this.logger?.error({ err: error, message }, `[tql] backbone listener failed for mutation: ${message.mutationName}`);
      }
    }
  }

  subscribe(listener: BackboneListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
