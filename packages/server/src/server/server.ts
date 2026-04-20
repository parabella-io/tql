import { MutationResolver, type ApplyMutationResponseMap } from '../mutation/index.js';
import { QueryResolver, type ApplyQueryResponseMap } from '../query/index.js';
import { generateSchema } from '../codegen/generate-schema.js';
import type { ClientSchema } from '../client-schema.js';
import type { Schema } from '../schema.js';
import type { HttpAdapter } from './adapters/http/http-adapter.js';

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
};

export class Server<S extends ClientSchema> {
  public readonly queryResolver: QueryResolver<S>;
  public readonly mutationResolver: MutationResolver<S>;

  private readonly contextFactory: (options: { request: unknown }) => Promise<any>;

  constructor(options: ServerOptions) {
    this.queryResolver = new QueryResolver<S>({ schema: options.schema });
    this.mutationResolver = new MutationResolver<S>({ schema: options.schema });
    this.contextFactory = options.createContext;
    this.runSchemaCodegen(options.schema, options.generateSchema);
  }

  public async createContext(options: { request: unknown }): Promise<any> {
    return this.contextFactory(options);
  }

  public async handleQuery<const Q extends Partial<S['QueryInputMap']>>(options: {
    request: unknown;
    query: Q;
  }): Promise<ApplyQueryResponseMap<S['QueryResponseMap'], Q>> {
    const context = await this.createContext({ request: options.request });

    return this.queryResolver.handle({
      context,
      query: options.query,
    });
  }

  public async handleMutation<const Q extends Partial<S['MutationInputMap']>>(options: {
    request: unknown;
    mutation: Q;
  }): Promise<ApplyMutationResponseMap<S['MutationResponseMap'], Q>> {
    const context = await this.createContext({ request: options.request });

    return this.mutationResolver.handle({
      context,
      mutation: options.mutation,
    });
  }

  public attachHttp(adapter: HttpAdapter<unknown>): this {
    adapter.post('/query', async (request) => {
      return this.handleQuery({
        request,
        query: adapter.getBody(request) as Partial<S['QueryInputMap']>,
      });
    });

    adapter.post('/mutation', async (request) => {
      return this.handleMutation({
        request,
        mutation: adapter.getBody(request) as Partial<S['MutationInputMap']>,
      });
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
