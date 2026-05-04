import type { TQLServerError } from '../errors.js';
import type { IncludeNode, MutationPlan, QueryNode, QueryPlan } from '../security/plan.js';
import type { AggregateCost, ServerContext } from './context.js';
import type { PluginContextExtensions, SchemaContextExtensions } from './extensions.js';
import type { ServerLike, ServerPlugin } from './plugin.js';

export type PluginRunnerOptions = {
  plugins?: ServerPlugin[];
  server?: ServerLike;
};

export class PluginRunner {
  private readonly plugins: ServerPlugin[];

  private readonly setupPromise: Promise<void>;

  constructor(options: PluginRunnerOptions = {}) {
    this.plugins = options.plugins ?? [];
    this.setupPromise = Promise.all(this.plugins.map((plugin) => plugin.setup?.(options.server ?? {}))).then(() => undefined);
  }

  public getRequestTimeoutMs(): number | undefined {
    const values = this.plugins
      .map((plugin) => plugin.requestTimeoutMs)
      .filter((value): value is number => value !== undefined);

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
      plugin: pluginContext as unknown as PluginContextExtensions,
    };
  }

  public async beforeQuery(ctx: ServerContext, plan: QueryPlan): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.beforeQuery?.(ctx, plan);
    }
  }

  public async beforeMutation(ctx: ServerContext, plan: MutationPlan): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.beforeMutation?.(ctx, plan);
    }
  }

  public async afterQuery(ctx: ServerContext, plan: QueryPlan, result: AggregateCost): Promise<void> {
    await Promise.all(this.plugins.map((plugin) => plugin.afterQuery?.(ctx, plan, result)));
  }

  public async afterMutation(ctx: ServerContext, plan: MutationPlan, result: AggregateCost): Promise<void> {
    await Promise.all(this.plugins.map((plugin) => plugin.afterMutation?.(ctx, plan, result)));
  }

  public wrapQueryNode<T>(ctx: ServerContext, node: QueryNode | IncludeNode, final: () => Promise<T>): Promise<T> {
    const wrapped = this.plugins.reduceRight(
      (next, plugin) => () => plugin.onResolveQueryNode?.({ ctx, node, next }) ?? next(),
      final,
    );

    return wrapped();
  }

  public wrapMutation<T>(ctx: ServerContext, entry: MutationPlan['entries'][number], final: () => Promise<T>): Promise<T> {
    const wrapped = this.plugins.reduceRight(
      (next, plugin) => () => plugin.onResolveMutation?.({ ctx, entry, next }) ?? next(),
      final,
    );

    return wrapped();
  }

  public transformError(ctx: ServerContext, error: TQLServerError): TQLServerError {
    let current = error;

    for (const plugin of this.plugins) {
      current = plugin.onError?.(ctx, current) ?? current;
    }

    return current;
  }
}

