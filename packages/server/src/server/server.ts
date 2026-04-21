import { randomUUID } from 'node:crypto';

import { MutationResolver, type CreateEmit, type MutationHandleResult, type PendingMutationEffect } from '../mutation/index.js';
import { QueryResolver, type ApplyQueryResponseMap } from '../query/index.js';
import { generateSchema } from '../codegen/generate-schema.js';
import type { ClientSchema } from '../client-schema.js';
import type { Schema } from '../schema.js';
import type { HttpAdapter, SseStream } from './adapters/http/http-adapter.js';
import type { WebSocketAdapter } from './adapters/websocket/websocket-adapter.js';
import type { EffectMeta, EffectQueue } from '../effects/effect-queue.js';
import { InMemoryEffectQueue, type EffectLogger } from '../effects/in-memory-effect-queue.js';
import { SubscriptionResolver } from '../subscription/subscription-resolver.js';
import type { SubscriberMessage } from '../subscription/subscription-registry.js';
import type { Backbone, BackboneMessage } from '../backbone/backbone.js';
import { InMemoryBackbone } from '../backbone/in-memory-backbone.js';
import { FormattedTQLServerError, TQLServerError, TQLServerErrorType } from '../errors.js';

export type GenerateSchemaConfig = {
  enabled: boolean;
  outputPath?: string;
};

const DEFAULT_GENERATE_SCHEMA_OUTPUT_PATH = './generated/schema.ts';

export type EffectsConfig = {
  /**
   * Supply a custom {@link EffectQueue} (e.g. backed by BullMQ, SQS, …).
   * When omitted, an in-memory queue is created using `p-queue`.
   */
  queue?: EffectQueue;
  /**
   * Concurrency for the default in-memory queue. Ignored when `queue` is provided.
   * Defaults to `Number.POSITIVE_INFINITY`.
   */
  concurrency?: number;
  /**
   * Logger used by the default in-memory queue for task failures when no
   * `onError` is provided. Ignored when `queue` is provided.
   */
  logger?: EffectLogger;
  /**
   * Called when an enqueued effect throws. For the default in-memory queue
   * this replaces the default logger behaviour. For custom queues the hook
   * is ignored here and must be wired inside the custom implementation.
   */
  onError?: (error: unknown, meta: EffectMeta) => void;
};

export type SubscriptionsConfig = {
  /**
   * Pluggable pub/sub transport used to fan mutation-emitted changes
   * out to subscription resolvers. Defaults to {@link InMemoryBackbone}.
   * Future implementations include Redis.
   */
  backbone?: Backbone;
  /**
   * Interval in milliseconds between SSE keep-alive comment frames
   * written to every open `/events` stream. Defaults to 15000ms. Set
   * to `0` (or a negative number) to disable keep-alives.
   */
  sseKeepAliveMs?: number;
};

const DEFAULT_SSE_KEEP_ALIVE_MS = 15_000;

export type ServerOptions<Connection = unknown> = {
  schema: Schema<any, any, any>;

  createContext: (options: { request: unknown }) => Promise<any>;
  /**
   * Invoked once per WebSocket connection to build the per-connection
   * data exposed to subscription `allow` / `filter` hooks. Type is
   * derived from the 3rd `Schema` generic.
   */
  createConnection?: (options: { request: unknown }) => Promise<Connection> | Connection;
  /**
   * Controls codegen of the `ClientSchema` TypeScript module.
   *
   *  - `undefined` / `true` → enabled, written to `./generated/schema.ts`.
   *  - `false`              → disabled.
   *  - `{ outputPath }`     → enabled, written to the supplied path.
   */
  generateSchema?: GenerateSchemaConfig;
  /**
   * Configures the pluggable effect queue used to run a mutation's optional
   * `resolveEffects` hook after the HTTP response has been scheduled.
   * Defaults to an in-memory `p-queue`.
   */
  effects?: EffectsConfig;
  /**
   * Configures the subscription backbone used to route mutation
   * `emit(...)` calls to subscribers. Defaults to an in-memory backbone.
   */
  subscriptions?: SubscriptionsConfig;
};

export class Server<S extends ClientSchema, Connection = unknown> {
  public readonly queryResolver: QueryResolver<S>;
  public readonly mutationResolver: MutationResolver<S>;
  public readonly subscriptionResolver: SubscriptionResolver;

  private readonly contextFactory: (options: { request: any }) => Promise<any>;

  private readonly connectionFactory?: (options: { request: any }) => Promise<Connection> | Connection;

  private readonly effectQueue: EffectQueue;

  private readonly backbone: Backbone;

  private readonly backboneUnsubscribe: () => void;

  private readonly sseKeepAliveMs: number;

  /**
   * Open SSE `/events` streams this server still owns. Each stream is
   * bound to exactly one subscription (`GET /events?name=...&args=...`);
   * the set is used by {@link dispose} to tear streams down on shutdown.
   */
  private readonly sseStreams: Set<SseStream> = new Set();

  constructor(options: ServerOptions<Connection>) {
    this.effectQueue = Server.createEffectQueue(options.effects);

    this.backbone = Server.createBackbone(options.subscriptions);

    this.sseKeepAliveMs = options.subscriptions?.sseKeepAliveMs ?? DEFAULT_SSE_KEEP_ALIVE_MS;

    this.queryResolver = new QueryResolver<S>({ schema: options.schema });

    this.subscriptionResolver = new SubscriptionResolver({ schema: options.schema });

    const createEmit: CreateEmit = ({ mutationName }) => {
      return (changes) => {
        const message: BackboneMessage = {
          mutationName,
          changes: changes as BackboneMessage['changes'],
        };

        Promise.resolve()
          .then(() => this.backbone.publish(message))
          .catch(() => {
            // Backbone transport failures must not bubble into a mutation
            // effect. The backbone itself handles logging / onError.
          });
      };
    };

    this.mutationResolver = new MutationResolver<S>({
      schema: options.schema,
      createEmit,
    });

    this.contextFactory = options.createContext;

    this.connectionFactory = options.createConnection;

    this.backboneUnsubscribe = this.backbone.subscribe((message) => this.subscriptionResolver.dispatch(message));

    this.runSchemaCodegen(options.schema, options.generateSchema);
  }

  /**
   * Waits for all queued mutation effects to complete. Useful for graceful
   * shutdown and deterministic tests.
   */
  public drainEffects(): Promise<void> {
    return this.effectQueue.drain();
  }

  /**
   * Detach the server's backbone listener and close any SSE streams
   * this server still owns. Intended for tests and clean process
   * shutdown — not required during normal operation.
   */
  public dispose(): void {
    this.backboneUnsubscribe();

    for (const stream of Array.from(this.sseStreams)) {
      try {
        stream.close();
      } catch {
        // Close errors during shutdown are informational only.
      }
    }

    this.sseStreams.clear();
  }

  private static createEffectQueue(config: EffectsConfig | undefined): EffectQueue {
    if (config?.queue) {
      return config.queue;
    }

    return new InMemoryEffectQueue({
      concurrency: config?.concurrency,
      logger: config?.logger,
      onError: config?.onError,
    });
  }

  private static createBackbone(config: SubscriptionsConfig | undefined): Backbone {
    if (config?.backbone) return config.backbone;
    return new InMemoryBackbone();
  }

  public async createContext(options: { request: any }): Promise<any> {
    return this.contextFactory(options);
  }

  public async createConnection(options: { request: any }): Promise<Connection | undefined> {
    if (!this.connectionFactory) return undefined;
    return this.connectionFactory(options);
  }

  public async handleQuery<const Q extends Partial<S['QueryInputMap']>>(options: {
    request: any;
    query: Q;
  }): Promise<ApplyQueryResponseMap<S['QueryResponseMap'], Q>> {
    const context = await this.createContext({ request: options.request });

    return this.queryResolver.handle({
      context,
      query: options.query,
    });
  }

  /**
   * Runs a batch of mutations and returns both the per-mutation results and
   * any pending effects declared by those mutations. Callers are responsible
   * for deciding when to invoke the effects - the server itself does so only
   * in {@link Server.attachHttp}, after the HTTP response has been flushed.
   */
  public async handleMutation<const Q extends Partial<S['MutationInputMap']>>(options: {
    request: any;
    mutation: Q;
  }): Promise<MutationHandleResult<S, Q>> {
    const context = await this.createContext({ request: options.request });

    return this.mutationResolver.handle({
      context,
      mutation: options.mutation,
    });
  }

  /**
   * Enqueue a batch of pending mutation effects onto the server-owned
   * {@link EffectQueue}. Used by the transport layer after the HTTP response
   * has been flushed to the client. Safe to call with an empty array.
   */
  public enqueueMutationEffects(effects: PendingMutationEffect[]): void {
    for (const effect of effects) {
      this.effectQueue.enqueue(() => effect.run(), {
        mutationName: effect.mutationName,
      });
    }
  }

  public attachHttp(adapter: HttpAdapter<any>): this {
    adapter.post('/query', async (request) => {
      return this.handleQuery({
        request,
        query: adapter.getBody(request) as Partial<S['QueryInputMap']>,
      });
    });

    adapter.post('/mutation', async (request, hooks) => {
      const { results, effects } = await this.handleMutation({
        request,
        mutation: adapter.getBody(request) as Partial<S['MutationInputMap']>,
      });

      if (effects.length > 0) {
        hooks.afterResponse(() => {
          this.enqueueMutationEffects(effects);
        });
      }

      return results;
    });

    adapter.sse('/events', async (request, stream) => {
      await this.handleSseEvents(request, stream, adapter.getQuery(request));
    });

    return this;
  }

  /**
   * SSE handler backing `GET /events?name=...&args=...`. Each stream
   * is bound to exactly one subscription: we parse `name` + `args`
   * from the query string, build per-request `context` /
   * `connection`, register with the subscription resolver, and tear
   * the subscription down when the stream closes.
   *
   * Protocol (see `SseTransport` on the client):
   *   - first frame:  `subscription:ready { subscriptionId }`
   *   - terminal err: `subscription:error { error }` (also on startup
   *                   failures, followed by `stream.close()`)
   *   - data frames:  `subscription:batch { rows, matches }`
   *   - keep-alive:   `:ka\n\n` comment frames
   */
  private async handleSseEvents(
    request: any,
    stream: SseStream,
    query: Record<string, string | string[] | undefined>,
  ): Promise<void> {
    this.sseStreams.add(stream);

    const write = (message: Record<string, unknown> | SubscriberMessage) => {
      stream.write(formatSseFrame(message));
    };

    const fail = (error: TQLServerError): void => {
      write({ type: 'subscription:error', error: formatError(error) });
      stream.close();
    };

    const name = asString(firstQueryValue(query.name));

    if (!name) {
      fail(new TQLServerError(TQLServerErrorType.SubscriptionError, { reason: 'events.name is required' }));
      return;
    }

    let args: unknown;

    try {
      args = parseArgsQueryParam(firstQueryValue(query.args));
    } catch (error) {
      fail(
        new TQLServerError(TQLServerErrorType.SubscriptionError, {
          reason: 'events.args must be a JSON-encoded object',
          error,
        }),
      );
      return;
    }

    let context: any;
    let connectionData: any;

    try {
      context = await this.contextFactory({ request });
      connectionData = this.connectionFactory ? await this.connectionFactory({ request }) : undefined;
    } catch (error) {
      fail(new TQLServerError(TQLServerErrorType.SubscriptionError, { reason: 'createContext or createConnection threw', error }));
      return;
    }

    // Each stream owns exactly one subscription, so the registry's
    // `connectionId` can just be a per-stream uuid — nothing else ever
    // looks it up.
    const connectionId = randomUUID();

    const result = await this.subscriptionResolver.subscribe({
      connectionId,
      subscriptionName: name,
      args,
      context,
      connection: connectionData,
      send: (message) => write(message),
    });

    if (!result.ok) {
      fail(result.error);
      return;
    }

    write({ type: 'subscription:ready', subscriptionId: result.id });

    let keepAlive: ReturnType<typeof setInterval> | undefined;

    if (this.sseKeepAliveMs > 0) {
      keepAlive = setInterval(() => {
        stream.write(':ka\n\n');
      }, this.sseKeepAliveMs);

      // Tests / short-lived processes shouldn't be kept alive by the
      // heartbeat timer alone.
      (keepAlive as unknown as { unref?: () => void }).unref?.();
    }

    stream.onClose(() => {
      if (keepAlive !== undefined) clearInterval(keepAlive);
      this.sseStreams.delete(stream);
      result.unsubscribe();
    });
  }

  /**
   * Wires a {@link WebSocketAdapter} into the server. A single WS
   * connection can carry queries, mutations, and subscriptions using
   * the JSON envelopes declared in `IncomingWsMessage`.
   *
   * The per-connection `context` is created once when the socket
   * connects (matches the subscription design: `filter` sees a
   * consistent subscriber context) and reused for every query /
   * mutation / subscription on that socket.
   */
  public attachWebSocket(adapter: WebSocketAdapter): this {
    adapter.onConnection(async (wsConnection) => {
      let context: any;
      let connectionData: any;

      try {
        context = await this.contextFactory({ request: wsConnection.request });

        connectionData = await (this.connectionFactory
          ? this.connectionFactory({ request: wsConnection.request })
          : Promise.resolve(undefined));
      } catch (error) {
        sendRaw(wsConnection, {
          type: 'connection:error',
          error: formatError(
            new TQLServerError(TQLServerErrorType.SubscriptionError, { reason: 'createContext or createConnection threw', error }),
          ),
        });

        wsConnection.close(1011, 'context initialisation failed');
        return;
      }

      const activeSubscriptionIds = new Set<string>();

      wsConnection.onMessage(async (raw) => {
        const parsed = parseIncoming(raw);

        if (!parsed.ok) {
          sendRaw(wsConnection, { type: 'error', error: formatError(parsed.error) });
          return;
        }

        const message = parsed.message;

        switch (message.type) {
          case 'query': {
            try {
              const results = await this.queryResolver.handle({
                context,
                query: message.payload as Partial<S['QueryInputMap']>,
              });
              sendRaw(wsConnection, { id: message.id, type: 'query:result', payload: results });
            } catch (error) {
              sendRaw(wsConnection, { id: message.id, type: 'query:error', error: formatUnknown(error) });
            }
            return;
          }

          case 'mutation': {
            try {
              const { results, effects } = await this.mutationResolver.handle({
                context,
                mutation: message.payload as Partial<S['MutationInputMap']>,
              });

              sendRaw(wsConnection, { id: message.id, type: 'mutation:result', payload: results });

              if (effects.length > 0) {
                this.enqueueMutationEffects(effects);
              }
            } catch (error) {
              sendRaw(wsConnection, { id: message.id, type: 'mutation:error', error: formatUnknown(error) });
            }
            return;
          }

          case 'subscribe': {
            const send = (payload: SubscriberMessage) => {
              sendRaw(wsConnection, payload);
            };

            const result = await this.subscriptionResolver.subscribe({
              connectionId: wsConnection.id,
              subscriptionName: message.name,
              args: message.args,
              context,
              connection: connectionData,
              send,
            });

            if (!result.ok) {
              sendRaw(wsConnection, { id: message.id, type: 'subscribe:error', error: formatError(result.error) });
              return;
            }

            activeSubscriptionIds.add(result.id);

            sendRaw(wsConnection, { id: message.id, type: 'subscribe:ack', subscriptionId: result.id });

            return;
          }

          case 'unsubscribe': {
            const removed = this.subscriptionResolver.unsubscribe(message.subscriptionId);
            activeSubscriptionIds.delete(message.subscriptionId);
            sendRaw(wsConnection, { id: message.id, type: 'unsubscribe:ack', removed });
            return;
          }
        }
      });

      wsConnection.onClose(() => {
        this.subscriptionResolver.removeConnection(wsConnection.id);
        activeSubscriptionIds.clear();
      });
    });

    return this;
  }

  private runSchemaCodegen(schema: Schema<any, any, any>, config: GenerateSchemaConfig | undefined): void {
    if (config?.enabled === false) {
      return;
    }

    const outputPath = typeof config === 'object' && config?.outputPath ? config.outputPath : DEFAULT_GENERATE_SCHEMA_OUTPUT_PATH;

    const result = generateSchema({ schema, outputPath });

    const { renderMs, diffMs, writeMs, totalMs } = result.timings;

    console.log(
      `[generateSchema] ${result.reason} (${totalMs.toFixed(2)}ms total — render ${renderMs.toFixed(2)}ms, diff ${diffMs.toFixed(2)}ms, write ${writeMs.toFixed(2)}ms)`,
    );
  }
}

// ===========================================================================
// WEBSOCKET WIRE PROTOCOL
// ===========================================================================

type IncomingWsMessage =
  | { id?: string; type: 'query'; payload: unknown }
  | { id?: string; type: 'mutation'; payload: unknown }
  | { id?: string; type: 'subscribe'; name: string; args: unknown }
  | { id?: string; type: 'unsubscribe'; subscriptionId: string };

const parseIncoming = (raw: string): { ok: true; message: IncomingWsMessage } | { ok: false; error: TQLServerError } => {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false, error: new TQLServerError(TQLServerErrorType.WebSocketMessageMalformedError, { reason: 'invalid JSON' }) };
  }

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { ok: false, error: new TQLServerError(TQLServerErrorType.WebSocketMessageMalformedError, { reason: 'not an object' }) };
  }

  const envelope = json as Record<string, unknown>;
  const type = envelope.type;

  switch (type) {
    case 'query':
    case 'mutation':
      return { ok: true, message: { id: asString(envelope.id), type, payload: envelope.payload } };
    case 'subscribe': {
      const name = asString(envelope.name);
      if (!name) {
        return {
          ok: false,
          error: new TQLServerError(TQLServerErrorType.WebSocketMessageMalformedError, { reason: 'subscribe.name is required' }),
        };
      }
      return { ok: true, message: { id: asString(envelope.id), type: 'subscribe', name, args: envelope.args } };
    }
    case 'unsubscribe': {
      const subscriptionId = asString(envelope.subscriptionId);
      if (!subscriptionId) {
        return {
          ok: false,
          error: new TQLServerError(TQLServerErrorType.WebSocketMessageMalformedError, {
            reason: 'unsubscribe.subscriptionId is required',
          }),
        };
      }
      return { ok: true, message: { id: asString(envelope.id), type: 'unsubscribe', subscriptionId } };
    }
    default:
      return { ok: false, error: new TQLServerError(TQLServerErrorType.WebSocketMessageUnsupportedError, { type }) };
  }
};

const asString = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined;
};

const formatError = (error: TQLServerError): FormattedTQLServerError => {
  return error.getFormattedError();
};

const formatUnknown = (error: unknown): FormattedTQLServerError => {
  if (error instanceof TQLServerError) return error.getFormattedError();
  return new TQLServerError(TQLServerErrorType.MutationError, { error }).getFormattedError();
};

const sendRaw = (connection: { send: (data: string) => void }, message: Record<string, unknown> | SubscriberMessage): void => {
  try {
    connection.send(JSON.stringify(message));
  } catch {
    // Send errors are the transport's problem, never the server's.
  }
};

// ===========================================================================
// SSE WIRE PROTOCOL
// ===========================================================================

const formatSseFrame = (message: Record<string, unknown> | SubscriberMessage): string => {
  return `data: ${JSON.stringify(message)}\n\n`;
};

const firstQueryValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) return value[0];
  return value;
};

/**
 * `/events?args=...` carries a JSON-encoded args object. Missing /
 * empty is treated as `{}` — subscriptions with empty `args` schemas
 * shouldn't have to URL-encode `{}` themselves.
 */
const parseArgsQueryParam = (raw: string | undefined): unknown => {
  if (raw === undefined || raw === '') return {};
  return JSON.parse(raw);
};
