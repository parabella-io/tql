import { MutationResolver, type MutationHandleResult, type PendingMutationEffect } from '../mutation/index.js';
import { QueryResolver, type ApplyQueryResponseMap } from '../query/index.js';
import { generateSchema } from '../codegen/generate-schema.js';
import type { ClientSchema } from '../client-schema.js';
import type { Schema } from '../schema.js';
import type { HttpAdapter } from './adapters/http/http-adapter.js';
import type { EffectMeta, EffectQueue } from '../effects/effect-queue.js';
import { InMemoryEffectQueue, type EffectLogger } from '../effects/in-memory-effect-queue.js';
import { TQLServerError } from '../errors.js';
import { buildMutationPlan, buildQueryPlan, type IncludeNode, type MutationPlan, type QueryNode } from '../security/index.js';
import { PluginRunner, type ServerContext, type ServerPlugin } from '../plugins/index.js';

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

export type ServerOptions = {
  schema: Schema<any, any>;

  createContext: (options: { request: unknown }) => Promise<any>;
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
  plugins?: ServerPlugin[];
};

export class Server<S extends ClientSchema> {
  public readonly queryResolver: QueryResolver<S>;

  public readonly mutationResolver: MutationResolver<S>;

  private readonly contextFactory: (options: { request: any }) => Promise<any>;

  private readonly effectQueue: EffectQueue;

  private readonly schema: Schema<any, any>;

  private readonly pluginRunner: PluginRunner;

  constructor(options: ServerOptions) {
    this.schema = options.schema;
    this.effectQueue = Server.createEffectQueue(options.effects);

    this.queryResolver = new QueryResolver<S>({ schema: options.schema });

    this.mutationResolver = new MutationResolver<S>({
      schema: options.schema,
    });

    this.contextFactory = options.createContext;

    this.pluginRunner = new PluginRunner({
      plugins: options.plugins,
    });

    this.runSchemaCodegen(options.schema, options.generateSchema);
  }

  /**
   * Waits for all queued mutation effects to complete. Useful for graceful
   * shutdown and deterministic tests.
   */
  public drainEffects(): Promise<void> {
    return this.effectQueue.drain();
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

  public async createContext(options: { request: any }): Promise<any> {
    return this.contextFactory(options);
  }

  public async handleQuery<const Q extends Partial<S['QueryInputMap']>>(options: {
    request: any;
    query: Q;
    body?: unknown;
  }): Promise<ApplyQueryResponseMap<S, Q>> {
    const context = await this.createContext({ request: options.request });
    const { serverContext, cleanup } = await this.createServerContext({
      request: options.request,
      body: options.body ?? options.query,
      schemaContext: context,
    });

    try {
      const plan = buildQueryPlan({ schema: this.schema, query: options.query });

      const nodesByPath = collectQueryNodes(plan.nodes);

      await this.pluginRunner.beforeQuery(serverContext, plan);

      const result = await this.queryResolver.handle({
        context,
        query: options.query,
        execution: {
          signal: serverContext.signal,
          resolverTimeouts: serverContext.resolverTimeouts,
          wrapQueryNode: (path, final) => {
            const node = nodesByPath.get(path);

            return node ? this.pluginRunner.wrapQueryNode(serverContext, node, final) : final();
          },
        },
      });

      await this.pluginRunner.afterQuery(serverContext, plan, serverContext.plugin.costs ?? {});

      return result;
    } catch (error) {
      if (error instanceof TQLServerError) {
        return formatQueryError(options.query, this.pluginRunner.transformError(serverContext, error)) as ApplyQueryResponseMap<S, Q>;
      }

      throw error;
    } finally {
      cleanup();
    }
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
    body?: unknown;
  }): Promise<MutationHandleResult<S, Q>> {
    const context = await this.createContext({ request: options.request });
    const { serverContext, cleanup } = await this.createServerContext({
      request: options.request,
      body: options.body ?? options.mutation,
      schemaContext: context,
    });

    try {
      const plan = buildMutationPlan({ schema: this.schema, mutation: options.mutation });
      const entriesByName = new Map(plan.entries.map((entry) => [entry.mutationName, entry]));

      await this.pluginRunner.beforeMutation(serverContext, plan);

      const result = await this.mutationResolver.handle({
        context,
        mutation: options.mutation,
        execution: {
          signal: serverContext.signal,
          resolverTimeouts: serverContext.resolverTimeouts,
          wrapMutation: (mutationName, final) => {
            const entry = entriesByName.get(mutationName);

            return entry ? this.pluginRunner.wrapMutation(serverContext, entry, final) : final();
          },
        },
      });

      await this.pluginRunner.afterMutation(serverContext, plan, serverContext.plugin.costs ?? {});

      return result;
    } catch (error) {
      if (error instanceof TQLServerError) {
        return {
          results: formatMutationError(options.mutation, this.pluginRunner.transformError(serverContext, error)) as any,
          effects: [],
        };
      }

      throw error;
    } finally {
      cleanup();
    }
  }

  private async createServerContext(options: {
    request: unknown;
    body: unknown;
    schemaContext: unknown;
  }): Promise<{ serverContext: ServerContext; cleanup: () => void }> {
    const controller = new AbortController();
    const timeoutMs = this.pluginRunner.getRequestTimeoutMs();
    const timeout =
      timeoutMs === undefined
        ? undefined
        : setTimeout(() => {
            controller.abort();
          }, timeoutMs);
    const serverContext = await this.pluginRunner.createContext({
      request: options.request,
      body: options.body,
      schemaContext: options.schemaContext,
      signal: controller.signal,
    });

    return {
      serverContext,
      cleanup: () => {
        if (timeout) clearTimeout(timeout);
      },
    };
  }

  /**
   * Enqueue a batch of pending mutation effects onto the server-owned
   * {@link EffectQueue}. Used by the transport layer after the HTTP response
   * has been flushed to the client. Safe to call with an empty array.
   */
  public enqueueMutationEffects(effects: PendingMutationEffect[]): void {
    for (const effect of effects) {
      this.effectQueue.enqueue(() => effect.run(), { mutationName: effect.mutationName });
    }
  }

  public attachHttp(adapter: HttpAdapter<any>): this {
    adapter.post('/query', async (request) => {
      const body = adapter.getBody(request);
      return this.handleQuery({
        request,
        body,
        query: body as Partial<S['QueryInputMap']>,
      });
    });

    adapter.post('/mutation', async (request, hooks) => {
      const body = adapter.getBody(request);
      const { results, effects } = await this.handleMutation({
        request,
        body,
        mutation: body as Partial<S['MutationInputMap']>,
      });

      if (effects.length > 0) {
        hooks.afterResponse(() => {
          this.enqueueMutationEffects(effects);
        });
      }

      return results;
    });

    return this;
  }

  private runSchemaCodegen(schema: Schema<any, any>, config: GenerateSchemaConfig | undefined): void {
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

const formatQueryError = (query: unknown, error: TQLServerError): Record<string, unknown> => {
  const input = query && typeof query === 'object' && !Array.isArray(query) ? (query as Record<string, unknown>) : {};

  return Object.fromEntries(
    Object.keys(input).map((queryName) => [
      queryName,
      {
        data: null,
        error: error.getFormattedError(),
        pagingInfo: null,
      },
    ]),
  );
};

const collectQueryNodes = (nodes: QueryNode[]): Map<string, QueryNode | IncludeNode> => {
  const map = new Map<string, QueryNode | IncludeNode>();
  const visit = (node: QueryNode | IncludeNode) => {
    map.set(node.path, node);

    for (const include of node.includes) {
      visit(include);
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  return map;
};

const formatMutationError = (mutation: unknown, error: TQLServerError): Record<string, unknown> => {
  const input = mutation && typeof mutation === 'object' && !Array.isArray(mutation) ? (mutation as Record<string, unknown>) : {};

  return Object.fromEntries(
    Object.keys(input).map((mutationName) => [
      mutationName,
      {
        data: null,
        error: error.getFormattedError(),
      },
    ]),
  );
};
