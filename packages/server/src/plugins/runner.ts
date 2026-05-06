import type { TQLServerError } from '../errors.js';
import { noopLogger, type Logger } from '../logging/index.js';
import type { IncludeNode, MutationPlan, QueryNode, QueryPlan } from '../request-plan/plan.js';
import type { ServerContext } from './context.js';
import type { PluginContextExtensions, SchemaContextExtensions } from './extensions.js';
import type { MutationAfterHookArgs, QueryAfterHookArgs, ServerLike, ServerPlugin } from './plugin.js';

export type PluginRunnerOptions = {
  plugins?: ServerPlugin[];
  server?: ServerLike;
  logger?: Logger;
};

export class PluginRunner {
  private readonly plugins: ServerPlugin[];

  private readonly server: ServerLike;

  private readonly logger: Logger;

  private readonly setupPromise: Promise<void>;

  constructor(options: PluginRunnerOptions = {}) {
    this.plugins = options.plugins ?? [];
    this.logger = options.logger ?? options.server?.log ?? noopLogger;
    this.server = options.server ?? { log: this.logger };
    this.setupPromise = Promise.all(this.plugins.map((plugin) => plugin.setup?.({ server: this.server }))).then(() => undefined);
  }

  public getRequestTimeoutMs(): number | undefined {
    const values = this.plugins.map((plugin) => plugin.requestTimeoutMs).filter((value): value is number => value !== undefined);

    return values.length === 0 ? undefined : Math.min(...values);
  }

  public async createContext(options: {
    request: unknown;
    body: unknown;
    schemaContext: unknown;
    signal: AbortSignal;
  }): Promise<ServerContext> {
    await this.setupPromise;

    const pluginContext: Record<string, unknown> = {};

    for (const plugin of this.plugins) {
      const part = await plugin.createPluginContext?.({
        request: options.request,
        body: options.body,
        schemaContext: options.schemaContext as SchemaContextExtensions,
        signal: options.signal,
        pluginContext: pluginContext as Partial<PluginContextExtensions>,
      });

      if (part) {
        Object.assign(pluginContext, part);
      }
    }

    return {
      request: options.request,
      body: options.body,
      schemaContext: options.schemaContext,
      signal: options.signal,
      resolverTimeouts: new Map(),
      logger: ((pluginContext as { logger?: Logger }).logger ?? this.logger) as Logger,
      plugin: pluginContext as unknown as PluginContextExtensions,
    };
  }

  public async beforeQuery(args: { ctx: ServerContext; plan: QueryPlan }): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.beforeQuery?.(args);
    }
  }

  public async beforeMutation(args: { ctx: ServerContext; plan: MutationPlan }): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.beforeMutation?.(args);
    }
  }

  public async afterQuery(args: QueryAfterHookArgs): Promise<void> {
    await Promise.all(this.plugins.map((plugin) => plugin.afterQuery?.(args)));
  }

  public async afterMutation(args: MutationAfterHookArgs): Promise<void> {
    await Promise.all(this.plugins.map((plugin) => plugin.afterMutation?.(args)));
  }

  public async afterResponse(args: { ctx: ServerContext }): Promise<void> {
    for (const plugin of this.plugins) {
      try {
        await plugin.afterResponse?.(args);
      } catch (error) {
        this.logger.error({ err: error, plugin: plugin.name }, '[tql] plugin afterResponse hook failed');
      }
    }
  }

  public wrapQueryNode<T>(ctx: ServerContext, node: QueryNode | IncludeNode, final: () => Promise<T>): Promise<T> {
    const wrapped = this.plugins.reduceRight((next, plugin) => () => plugin.onResolveQueryNode?.({ ctx, node, next }) ?? next(), final);

    return wrapped();
  }

  public wrapMutation<T>(ctx: ServerContext, entry: MutationPlan['entries'][number], final: () => Promise<T>): Promise<T> {
    const wrapped = this.plugins.reduceRight((next, plugin) => () => plugin.onResolveMutation?.({ ctx, entry, next }) ?? next(), final);

    return wrapped();
  }

  public transformError(ctx: ServerContext, error: TQLServerError): TQLServerError {
    let current = error;

    for (const plugin of this.plugins) {
      current = plugin.onError?.({ ctx, error: current }) ?? current;
    }

    return current;
  }
}
