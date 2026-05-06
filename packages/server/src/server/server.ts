import { MutationResolver, type ApplyMutationResponseMap } from '../mutation/index.js';
import { QueryResolver, type ApplyQueryResponseMap } from '../query/index.js';
import { generateSchema } from '../codegen/generate-schema.js';
import type { ClientSchema } from '../client-schema.js';
import type { Schema } from '../schema.js';
import type { HttpAdapter } from './adapters/http/http-adapter.js';
import { TQLServerError } from '../errors.js';
import { pinoLogger, type Logger } from '../logging/index.js';
import { buildMutationPlan, buildQueryPlan, type IncludeNode, type MutationPlan, type QueryNode } from '../request-plan/index.js';
import { PluginRunner, type ServerContext, type ServerPlugin } from '../plugins/index.js';

export type GenerateSchemaConfig = {
  enabled: boolean;
  outputPath?: string;
};

const DEFAULT_GENERATE_SCHEMA_OUTPUT_PATH = './generated/schema.ts';

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
  logger?: Logger;
  plugins?: ServerPlugin[];
};

export type ServerMutationHandleResult<S extends ClientSchema, Q extends Partial<S['MutationInputMap']>> = {
  results: ApplyMutationResponseMap<S['MutationResponseMap'], Q>;
  finalize(): Promise<void>;
};

export class Server<S extends ClientSchema> {
  public readonly queryResolver: QueryResolver<S>;

  public readonly mutationResolver: MutationResolver<S>;

  private readonly contextFactory: (options: { request: any }) => Promise<any>;

  private readonly schema: Schema<any, any>;

  private readonly pluginRunner: PluginRunner;

  private readonly logger: Logger;

  constructor(options: ServerOptions) {
    this.schema = options.schema;

    this.queryResolver = new QueryResolver<S>({ schema: options.schema });

    this.mutationResolver = new MutationResolver<S>({
      schema: options.schema,
    });

    this.contextFactory = options.createContext;
    this.logger = options.logger ?? pinoLogger();

    this.pluginRunner = new PluginRunner({
      plugins: options.plugins,
      server: { log: this.logger },
      logger: this.logger,
    });

    this.runSchemaCodegen(options.schema, options.generateSchema);
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

      await this.pluginRunner.beforeQuery({ ctx: serverContext, plan });

      const result = await this.queryResolver.handle({
        context,
        query: options.query,
        execution: {
          signal: serverContext.signal,
          resolverTimeouts: serverContext.resolverTimeouts,
          wrapQueryNode: (path, meta, final) => {
            const node = nodesByPath.get(path);

            return node ? this.pluginRunner.wrapQueryNode(serverContext, node, meta, final) : final();
          },
          wrapExternalField: (node, meta, final) => this.pluginRunner.wrapExternalField(serverContext, node, meta, final),
        },
      });

      await this.pluginRunner.afterQuery({
        ctx: serverContext,
        plan,
        result: result as Record<string, unknown>,
        costs: serverContext.plugin.costs ?? {},
      });

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

  public async handleMutation<const Q extends Partial<S['MutationInputMap']>>(options: {
    request: any;
    mutation: Q;
    body?: unknown;
  }): Promise<ServerMutationHandleResult<S, Q>> {
    const context = await this.createContext({ request: options.request });

    const { serverContext, cleanup } = await this.createServerContext({
      request: options.request,
      body: options.body ?? options.mutation,
      schemaContext: context,
    });

    try {
      const plan = buildMutationPlan({ schema: this.schema, mutation: options.mutation });

      const entriesByName = new Map(plan.entries.map((entry) => [entry.mutationName, entry]));

      await this.pluginRunner.beforeMutation({ ctx: serverContext, plan });

      const { results, inputs } = await this.mutationResolver.handle({
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

      await this.pluginRunner.afterMutation({
        ctx: serverContext,
        plan,
        result: results as Record<string, { data: unknown; error: unknown }>,
        inputs,
        costs: serverContext.plugin.costs ?? {},
      });

      return {
        results,
        finalize: () => this.pluginRunner.afterResponse({ ctx: serverContext }),
      };
    } catch (error) {
      if (error instanceof TQLServerError) {
        return {
          results: formatMutationError(options.mutation, this.pluginRunner.transformError(serverContext, error)) as any,
          finalize: async () => {},
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

      const { results, finalize } = await this.handleMutation({
        request,
        body,
        mutation: body as Partial<S['MutationInputMap']>,
      });

      hooks.afterResponse(() => finalize());

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

    this.logger.info({ reason: result.reason, totalMs, renderMs, diffMs, writeMs }, '[generateSchema] codegen complete');
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
