import { z } from 'zod';
import { Model } from './model.js';
import { IncludeSingle } from './include-single.js';
import { IncludeMany } from './include-many.js';
import { QuerySingle } from './query-single.js';
import { QueryMany } from './query-many.js';
import { Schema } from '../schema.js';
import { FormattedTQLServerError, TQLServerError, TQLServerErrorType } from '../errors.js';
import { selectFields } from './select-fields.js';
import { ExtractEntityShape } from '../extract-entity-shape.js';
import type { ClientSchema } from '../client-schema.js';

export type QueryResolverOptions = {
  schema: Schema<any, any>;
};

/**
 * Project the full {@link QueryResponseMap} down to just the keys present in
 * a given query input `Q`. This is the per-call return type for `handle`.
 */
export type ApplyQueryResponseMap<QueryResponseMap, Q> = {
  [K in keyof Q & keyof QueryResponseMap]: QueryResponseMap[K];
};

/**
 * QueryResolver is constructed against a {@link Schema} and the codegen-emitted
 * {@link ClientSchema} aggregate (which carries `QueryInputMap`, `QueryResponseMap`
 * and `SchemaEntities`). Runtime behaviour is unchanged — the resolver still
 * walks every model on the schema and builds its own per-query and
 * per-include indexes — but the return type of `handle` is narrowed to only
 * the queries the caller actually requested.
 */
export class QueryResolver<S extends ClientSchema> {
  /**
   * Phantom type bag. Grouped under a single property so hovering the
   * resolver instance only resolves one member instead of expanding three
   * giant mapped types over `S['QueryInputMap']` / `S['QueryResponseMap']` /
   * `S['SchemaEntities']` per inspection.
   *
   * Use `typeof queryResolver.$types.QueryInput` etc. to recover the shapes.
   */
  declare $types: {
    QueryInput: Partial<S['QueryInputMap']>;
    QueryResponse: S['QueryResponseMap'];
    SchemaEntities: S['SchemaEntities'];
  };

  private readonly schema: Schema<any, any>;

  private readonly models: Record<string, Model<any, any, any, any, any, any, any>> = {};

  private readonly queryTypes: Record<string, 'single' | 'many'> = {};

  private readonly querySingles: Record<string, QuerySingle<any, any, any, any, any, any>> = {};

  private readonly queryManys: Record<string, QueryMany<any, any, any, any, any>> = {};

  private readonly includeQueryTypes: Record<string, 'includeSingle' | 'includeMany'> = {};

  private readonly includeSingles: Record<string, Record<string, IncludeSingle<any, any, any, any, any, any, any>>> = {};

  private readonly includeManys: Record<string, Record<string, IncludeMany<any, any, any, any, any, any>>> = {};

  public invokeCount = 0;

  constructor(options: QueryResolverOptions) {
    this.schema = options.schema;

    for (const modelName of Object.keys(this.schema.models)) {
      const model = this.schema.models[modelName] as Model<any, any, any, any, any, any, any>;

      this.models[modelName] = model;

      for (const { queryName, querySingle } of model.getQuerySingles()) {
        this.querySingles[queryName] = querySingle;
        this.queryTypes[queryName] = 'single';
      }

      for (const { queryName, queryMany } of model.getQueryManys()) {
        this.queryManys[queryName] = queryMany;
        this.queryTypes[queryName] = 'many';
      }

      for (const { includeName, includeSingle } of model.getIncludeSingles()) {
        if (!this.includeSingles[modelName]) {
          this.includeSingles[modelName] = {};
        }
        this.includeSingles[modelName][includeName] = includeSingle;
        this.includeQueryTypes[getIncludeQueryType(modelName, includeName)] = 'includeSingle';
      }

      for (const { includeName, includeMany } of model.getIncludeManys()) {
        if (!this.includeManys[modelName]) {
          this.includeManys[modelName] = {};
        }
        this.includeManys[modelName][includeName] = includeMany;
        this.includeQueryTypes[getIncludeQueryType(modelName, includeName)] = 'includeMany';
      }
    }
  }

  public async handle<const Q extends Partial<S['QueryInputMap']>>(options: {
    context: any;
    query: Q;
  }): Promise<ApplyQueryResponseMap<S['QueryResponseMap'], Q>> {
    const { context, query: queryInput } = options;

    this.invokeCount = 0;

    const response = {} as any;

    if (Object.keys(queryInput as Record<string, unknown>).length === 0) {
      return response;
    }

    const requests: Promise<{
      queryName: string;
      data: Record<string, any> | Array<Record<string, any>> | null;
      metadata: Record<string, any>;
      error: FormattedTQLServerError | null;
    }>[] = [];

    for (const queryName of Object.keys(queryInput as Record<string, unknown>) as Array<keyof Q & string>) {
      if (this.queryTypes[queryName] === 'single') {
        requests.push(this.handleQuerySingle({ context, queryInput, queryName }));
      }

      if (this.queryTypes[queryName] === 'many') {
        requests.push(this.handleQueryMany({ context, queryInput, queryName }));
      }
    }

    const results = await Promise.all(Object.values(requests));

    for (const result of results) {
      response[result.queryName] = {
        data: result.data,
        error: result.error,
        metadata: result.metadata,
      };
    }

    return response;
  }

  public async handleBatch<const QS extends Record<string, Partial<S['QueryInputMap']>>>(options: {
    context: any;
    queries: QS;
  }): Promise<{ [K in keyof QS]: ApplyQueryResponseMap<S['QueryResponseMap'], QS[K]> }> {
    const { context, queries } = options;

    const entries = Object.entries(queries) as Array<[keyof QS & string, QS[keyof QS]]>;

    if (entries.length === 0) {
      return {} as any;
    }

    const results = await Promise.all(
      entries.map(async ([key, query]) => {
        const res = await this.handle({ context, query: query as Partial<S['QueryInputMap']> });
        return [key, res] as const;
      }),
    );

    return Object.fromEntries(results) as any;
  }

  private async handleQuerySingle<Q extends Partial<S['QueryInputMap']>>(options: {
    context: any;
    queryInput: Q;
    queryName: keyof Q & string;
  }): Promise<{
    queryName: keyof Q & string;
    data: Record<string, any> | null;
    error: FormattedTQLServerError | null;
    metadata: Record<string, any>;
  }> {
    const { context, queryInput, queryName } = options;

    let data: Record<string, any> | null = null;
    let formattedError: FormattedTQLServerError | null = null;
    let metadata: Record<string, any> = {};

    try {
      const { data: parsedQuery, error: parsedError } = HandleQuerySingleInputSchema.safeParse(queryInput[queryName]);

      if (parsedError) {
        throw new TQLServerError(TQLServerErrorType.QueryInputSchemaValidationError, { queryName, message: parsedError.message });
      }

      const querySingle = this.querySingles[queryName];
      if (!querySingle) {
        throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, {
          queryName,
        });
      }

      const modelName = querySingle.getModelName();

      const model = this.models[modelName];

      if (!model) {
        throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, {
          queryName,
        });
      }

      const { resolve } = querySingle.getOptions();

      const isAllowed = querySingle.getAllow();

      if (!(await isAllowed({ context, query: parsedQuery.query }))) {
        throw new TQLServerError(TQLServerErrorType.QueryNotAllowedError, {
          queryName,
        });
      }

      const isNullable = querySingle.isNullable();

      const entity = await resolve({ context, query: parsedQuery.query });

      if (entity !== null) {
        const isAllowedForEntity = model.getAllowEach();

        if (!isAllowedForEntity({ context, entity })) {
          throw new TQLServerError(TQLServerErrorType.QueryNotAllowedError, {
            queryName,
          });
        }
      }

      const schema = model.getSchema();

      const schemaWithModel = schema.extend({
        __model: z.string(modelName).default(modelName),
      });

      const parsedResult = isNullable ? schemaWithModel.nullable().safeParse(entity) : schemaWithModel.safeParse(entity);

      if (parsedResult.error) {
        throw new TQLServerError(TQLServerErrorType.QueryEntitySchemaValidationError, { queryName, message: parsedResult.error.message });
      }

      data = selectFields(parsedResult.data, parsedQuery.select);

      if (parsedQuery.include) {
        const includeData = await this.handleInclude({
          context,
          parentEntities: [entity],
          parentPath: queryName,
          parentModelName: modelName,
          parentInclude: parsedQuery.include,
        });

        data = mergeIncludeData(data, includeData);
      }

      const metaOptions = (querySingle as any).getMetadataOptions?.() as
        | Record<string, { schema: z.ZodTypeAny; resolve: (options: any) => any }>
        | undefined;

      const requestedMeta = (queryInput[queryName] as any)?.metadata;

      if (metaOptions && requestedMeta && typeof requestedMeta === 'object') {
        metadata = {};
        for (const key of Object.keys(requestedMeta)) {
          if (requestedMeta[key] !== true) continue;
          const def = metaOptions[key];
          if (!def) {
            throw new TQLServerError(TQLServerErrorType.QueryMetadataSchemaValidationError, {
              queryName,
              message: `Unknown metadata key: ${key}`,
              key,
            });
          }
          const raw = await def.resolve({ context, query: parsedQuery.query });
          const parsed = def.schema.safeParse(raw);
          if (!parsed.success) {
            throw new TQLServerError(TQLServerErrorType.QueryMetadataSchemaValidationError, {
              queryName,
              message: parsed.error.message,
              key,
            });
          }
          metadata[key] = parsed.data;
        }
      }
    } catch (error) {
      if (error instanceof TQLServerError) {
        data = null;
        metadata = {};
        formattedError = error.getFormattedError();
      } else {
        data = null;
        metadata = {};
        formattedError = new TQLServerError(TQLServerErrorType.QueryError, {
          queryName,
          error,
        }).getFormattedError();
      }
    }

    this.invokeCount++;

    return {
      queryName,
      data,
      error: formattedError,
      metadata,
    };
  }

  private async handleQueryMany<Q extends Partial<S['QueryInputMap']>>(options: {
    context: any;
    queryInput: Q;
    queryName: keyof Q & string;
  }): Promise<{
    queryName: keyof Q & string;
    data: Array<Record<string, any>> | null;
    error: FormattedTQLServerError | null;
    metadata: Record<string, any>;
  }> {
    const { context, queryInput, queryName } = options;

    let data: Array<Record<string, any>> | null = null;

    let formattedError: FormattedTQLServerError | null = null;

    let metadata: Record<string, any> = {};

    try {
      const queryMany = this.queryManys[queryName];
      const { data: parsedQuery, error: parsedError } = HandleQueryManyInputSchema.safeParse(queryInput[queryName]);

      if (parsedError) {
        throw new TQLServerError(TQLServerErrorType.QueryInputSchemaValidationError, { queryName, message: parsedError.message });
      }

      if (!queryMany) {
        throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, {
          queryName,
        });
      }

      const modelName = queryMany.getModelName();

      const model = this.models[modelName];

      if (!model) {
        throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, {
          queryName,
        });
      }

      const { resolve } = queryMany.getOptions();

      const isAllowed = queryMany.getAllow();

      if (!(await isAllowed({ context, query: parsedQuery.query }))) {
        throw new TQLServerError(TQLServerErrorType.QueryNotAllowedError, {
          queryName,
        });
      }

      const entities = await resolve({ context, query: parsedQuery.query });

      const schema = model.getSchema();

      const schemaWithModel = z.array(
        schema.extend({
          __model: z.literal(modelName).default(modelName),
        }),
      );

      const parsedResult = schemaWithModel.safeParse(entities);

      if (parsedResult.error) {
        throw new TQLServerError(TQLServerErrorType.QueryEntitySchemaValidationError, {
          queryName,
          message: parsedResult.error.message,
          parsedQuery,
        });
      }

      data = selectFields(parsedResult.data, parsedQuery.select) as Array<Record<string, any>>;

      if (parsedQuery.include) {
        const includeData = await this.handleInclude({
          context,
          parentEntities: entities,
          parentPath: queryName,
          parentModelName: modelName,
          parentInclude: parsedQuery.include,
        });

        data = mergeIncludeData(data, includeData);
      }

      const metaDataOptions = queryMany.getMetadataOptions();

      const requestedMeta = (queryInput[queryName] as any)?.metadata;

      if (metaDataOptions && requestedMeta && typeof requestedMeta === 'object') {
        metadata = {};

        for (const key of Object.keys(requestedMeta)) {
          if (requestedMeta[key] !== true) continue;

          const def = (metaDataOptions as any)[key] as { schema: z.ZodTypeAny; resolve: (options: any) => any } | undefined;

          if (!def) {
            throw new TQLServerError(TQLServerErrorType.QueryMetadataSchemaValidationError, {
              queryName,
              message: `Unknown metadata key: ${key}`,
            });
          }

          const resolvedMetadata = await def.resolve({
            context,
            query: parsedQuery.query,
          });

          const parsed = def.schema.safeParse(resolvedMetadata);

          if (!parsed.success) {
            throw new TQLServerError(TQLServerErrorType.QueryMetadataSchemaValidationError, {
              queryName,
              message: parsed.error.message,
              key,
            });
          }

          metadata[key] = parsed.data;
        }
      }
    } catch (error) {
      if (error instanceof TQLServerError) {
        data = null;
        metadata = {};
        formattedError = error.getFormattedError();
      } else {
        data = null;
        metadata = {};
        formattedError = new TQLServerError(TQLServerErrorType.QueryError, {
          queryName,
          error,
        }).getFormattedError();
      }
    }

    this.invokeCount++;

    return {
      queryName,
      data,
      error: formattedError,
      metadata,
    };
  }

  private async handleInclude(options: {
    context: any;
    parentEntities: any[];
    parentPath: string;
    parentModelName: string;
    parentInclude: any;
  }) {
    const { context, parentEntities, parentPath, parentModelName, parentInclude } = options;

    const includeData: IncludedDataMap = {};

    const walkIncludeInput = async (parentInclude: any, parentEntities: any[], parentModelName: string, parentPath: string) => {
      const includeNames = Object.keys(parentInclude);

      await Promise.all(
        includeNames.map(async (includeName) => {
          const includeInput = parentInclude[includeName];
          const includePath = `${parentPath}.${includeName}`;
          const includeType = this.includeQueryTypes[getIncludeQueryType(parentModelName, includeName)];

          if (includeType === 'includeSingle') {
            const includeSingle = this.includeSingles[parentModelName][includeName];
            const includeModelName = includeSingle.getModelName();
            const includeRelationName = includeSingle.getRelationName();

            if (!includeModelName) {
              throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, { modelName: includeModelName, includeName });
            }

            let result = await this.handleIncludeSingle({
              context,
              parentEntities,
              modelName: includeModelName,
              includeName,
              includeInput,
            });

            if (result.length === 0) {
              result = parentEntities.map((parent) => ({
                parentId: parent.id,
                entity: null,
                rawEntity: null,
              }));
            }

            includeData[includePath] = result;

            if (includeInput.include) {
              await walkIncludeInput(
                includeInput.include,
                result.map((item) => item.rawEntity).filter((entity): entity is NonNullable<typeof entity> => entity !== null),
                includeRelationName,
                includePath,
              );
            }
          }

          if (includeType === 'includeMany') {
            const includeMany = this.includeManys[parentModelName][includeName];
            const includeModelName = includeMany.getModelName();
            const includeRelationName = includeMany.getRelationName();

            if (!includeModelName) {
              throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, { modelName: includeModelName, includeName });
            }

            let result = await this.handleIncludeMany({
              context,
              parentEntities,
              modelName: includeModelName,
              includeName,
              includeInput,
            });

            if (result.length === 0) {
              result = parentEntities.map((parent) => ({
                parentId: parent.id,
                entities: [],
                rawEntities: [],
              }));
            }

            includeData[includePath] = result;

            if (includeInput.include) {
              await walkIncludeInput(
                includeInput.include,
                result.flatMap((item) => item.rawEntities),
                includeRelationName,
                includePath,
              );
            }
          }
        }),
      );
    };

    await walkIncludeInput(parentInclude, parentEntities, parentModelName, parentPath);

    return includeData;
  }

  private async handleIncludeSingle(options: {
    context: any;
    parentEntities: ExtractEntityShape<any, any>[];
    modelName: string;
    includeName: string;
    includeInput: any;
  }): Promise<
    Array<{
      parentId: string;
      entity: ExtractEntityShape<any, any> | null;
      rawEntity: Record<string, any> | null;
    }>
  > {
    const { context, parentEntities, modelName, includeName, includeInput } = options;

    const includeSingle = this.includeSingles[modelName][includeName];

    if (!includeSingle) {
      throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, {
        modelName,
        includeName,
      });
    }

    const includeModelName = includeSingle.getRelationName();

    const model = this.models[includeModelName];

    if (!model) {
      throw new TQLServerError(TQLServerErrorType.QueryModelNotFoundError, {
        modelName,
        includeModelName,
      });
    }

    const includeOptions = includeSingle.getOptions();
    const { resolve } = includeOptions;

    const { data: parsedQuery, error: parsedError } = HandleIncludeSingleInputSchema.safeParse({
      ...includeInput,
      parents: parentEntities,
    });

    if (parsedError) {
      throw new TQLServerError(TQLServerErrorType.QueryInputSchemaValidationError, {
        modelName,
        includeName,
        message: parsedError.message,
      });
    }

    const result = await (resolve as any)({
      context,
      query: parsedQuery.query,
      parents: parsedQuery.parents,
    });

    const schema = model.getSchema();

    const schemaWithModel = schema.extend({
      __model: z.literal(includeModelName).default(includeModelName),
    });

    const matchKey = includeSingle.getMatchKey();
    const entitiesByParentId = new Map<string, Record<string, any>>();

    for (const entity of result as Array<Record<string, any>>) {
      const parentId = entity[matchKey];
      const parsedEntity = schemaWithModel.safeParse(entity);

      if (parsedEntity.error) {
        throw new TQLServerError(TQLServerErrorType.QueryEntitySchemaValidationError, {
          modelName,
          includeModelName,
          message: parsedEntity.error.message,
        });
      }

      if (typeof parentId !== 'string') {
        throw new TQLServerError(TQLServerErrorType.QueryEntitySchemaValidationError, {
          modelName,
          includeModelName,
          message: `Expected includeSingle matchKey "${matchKey}" to resolve to a string.`,
        });
      }

      if (!entitiesByParentId.has(parentId)) {
        entitiesByParentId.set(parentId, parsedEntity.data);
      }
    }

    const data = parentEntities.map((parent) => {
      const rawEntity = entitiesByParentId.get(parent.id) ?? null;

      return {
        parentId: parent.id,
        entity: rawEntity === null ? null : selectFields(rawEntity, includeInput.select),
        rawEntity,
      };
    });

    this.invokeCount++;

    return data;
  }

  private async handleIncludeMany(options: {
    context: any;
    parentEntities: ExtractEntityShape<any, any>[];
    modelName: string;
    includeName: string;
    includeInput: any;
  }): Promise<
    Array<{
      parentId: string;
      entities: Array<ExtractEntityShape<any, any>>;
      rawEntities: Array<Record<string, any>>;
    }>
  > {
    const { context, parentEntities, modelName, includeName, includeInput } = options;

    const includeMany = this.includeManys[modelName][includeName];

    if (!includeMany) {
      throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, {
        modelName,
        includeName,
      });
    }

    const includeModelName = includeMany.getRelationName();

    const model = this.models[includeModelName];

    if (!model) {
      throw new TQLServerError(TQLServerErrorType.QueryModelNotFoundError, {
        modelName,
        includeModelName,
      });
    }

    const includeOptions = includeMany.getOptions();
    const { resolve } = includeOptions;

    const { data: parsedQuery, error: parsedError } = HandleIncludeManyInputSchema.safeParse({
      ...includeInput,
      parents: parentEntities,
    });

    if (parsedError) {
      throw new TQLServerError(TQLServerErrorType.QueryInputSchemaValidationError, {
        modelName,
        includeName,
        message: parsedError.message,
      });
    }

    const result = await (resolve as any)({
      context,
      query: parsedQuery.query,
      parents: parsedQuery.parents,
    });

    const schema = model.getSchema();

    const schemaWithModel = schema.extend({
      __model: z.literal(includeModelName).default(includeModelName),
    });

    const matchKey = includeMany.getMatchKey();
    const entitiesByParentId = new Map<string, Array<Record<string, any>>>();

    for (const entity of result as Array<Record<string, any>>) {
      const parentId = entity[matchKey];
      const parsedEntity = schemaWithModel.safeParse(entity);

      if (parsedEntity.error) {
        throw new TQLServerError(TQLServerErrorType.QueryEntitySchemaValidationError, {
          modelName,
          includeModelName,
          message: parsedEntity.error.message,
        });
      }

      if (typeof parentId !== 'string') {
        throw new TQLServerError(TQLServerErrorType.QueryEntitySchemaValidationError, {
          modelName,
          includeModelName,
          message: `Expected includeMany matchKey "${matchKey}" to resolve to a string.`,
        });
      }

      const existingEntities = entitiesByParentId.get(parentId);

      if (existingEntities) {
        existingEntities.push(parsedEntity.data);
      } else {
        entitiesByParentId.set(parentId, [parsedEntity.data]);
      }
    }

    const data = parentEntities.map((parent) => {
      const rawEntities = entitiesByParentId.get(parent.id) ?? [];

      return {
        parentId: parent.id,
        entities: selectFields(rawEntities, includeInput.select),
        rawEntities,
      };
    });

    this.invokeCount++;

    return data;
  }
}

const HandleQuerySingleInputSchema = z.object({
  query: z.any(),
  select: z.any(),
  include: z.any(),
  metadata: z.any().optional(),
});

const HandleQueryManyInputSchema = z.object({
  query: z.any(),
  select: z.any(),
  include: z.any(),
  metadata: z.any().optional(),
});

const HandleIncludeSingleInputSchema = z.object({
  query: z.any(),
  select: z.any(),
  include: z.any(),
  parents: z.array(z.any()),
});

const HandleIncludeManyInputSchema = z.object({
  query: z.any(),
  select: z.any(),
  parents: z.array(z.any()),
  include: z.any(),
});

const getIncludeQueryType = (modelName: string, includeName: string) => {
  return `${modelName}-${includeName}`;
};

export type IncludedDataMap = Record<
  string,
  Array<{
    parentId: string;
    entity?: ExtractEntityShape<any, any> | null;
    entities?: Array<ExtractEntityShape<any, any>>;
  }>
>;

export const mergeIncludeData = (parentData: any, includeData: IncludedDataMap) => {
  if (!parentData || !includeData) {
    return parentData;
  }

  type MergeResult = { value: any; attachedCount: number; changed: boolean };

  const getIncludeNameFromPath = (path: string) => {
    const parts = path.split('.').filter(Boolean);
    return parts[parts.length - 1] ?? path;
  };

  const applyIncludeToTree = (node: any, includeName: string, byParentId: Map<string, any>): MergeResult => {
    if (node === null || node === undefined) {
      return { value: node, attachedCount: 0, changed: false };
    }

    if (Array.isArray(node)) {
      let changed = false;
      let attachedCount = 0;
      const next = node.map((item) => {
        const res = applyIncludeToTree(item, includeName, byParentId);
        if (res.changed) changed = true;
        attachedCount += res.attachedCount;
        return res.value;
      });

      return { value: changed ? next : node, attachedCount, changed };
    }

    if (typeof node !== 'object') {
      return { value: node, attachedCount: 0, changed: false };
    }

    const id = (node as any).id;
    const hasAttach = typeof id === 'string' && byParentId.has(id);
    const attachValue = hasAttach ? byParentId.get(id) : undefined;

    let changed = false;
    let attachedCount = 0;

    let nextObj: any = node;
    for (const key of Object.keys(node)) {
      const child = (node as any)[key];
      const res = applyIncludeToTree(child, includeName, byParentId);
      if (res.changed) {
        if (nextObj === node) nextObj = { ...(node as any) };
        nextObj[key] = res.value;
        changed = true;
      }
      attachedCount += res.attachedCount;
    }

    if (hasAttach) {
      if (nextObj === node) nextObj = { ...(node as any) };
      nextObj[includeName] = attachValue;
      changed = true;
      attachedCount += 1;
    }

    return { value: nextObj, attachedCount, changed };
  };

  let result = parentData;

  const pending = new Map<string, IncludedDataMap[string]>(Object.entries(includeData));

  const maxPasses = Math.max(1, pending.size + 2);

  for (let pass = 0; pass < maxPasses && pending.size > 0; pass++) {
    let madeProgress = false;

    for (const [path, items] of Array.from(pending.entries())) {
      const includeName = getIncludeNameFromPath(path);

      const byParentId = new Map<string, any>();
      for (const item of items) {
        if ('entities' in item && Array.isArray(item.entities)) {
          byParentId.set(item.parentId, item.entities);
        } else if ('entity' in item) {
          byParentId.set(item.parentId, item.entity);
        }
      }

      const res = applyIncludeToTree(result, includeName, byParentId);

      if (res.attachedCount > 0) {
        result = res.value;
        pending.delete(path);
        madeProgress = true;
      }
    }

    if (!madeProgress) break;
  }

  return result;
};
