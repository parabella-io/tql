import { z } from 'zod';

import type { Schema } from '../schema.js';
import { Model } from '../query/model.js';
import { QueryMany, type PagingInputArgs } from '../query/query-many.js';
import { QuerySingle } from '../query/query-single.js';
import { IncludeMany } from '../query/include-many.js';
import { IncludeSingle } from '../query/include-single.js';
import { Mutation } from '../mutation/mutation.js';
import { TQLServerError, TQLServerErrorType } from '../errors.js';

export type QueryNode = {
  path: string;
  queryName: string;
  modelName: string;
  kind: 'single' | 'many';
  selectAll: boolean;
  selectKeys: string[];
  query: unknown;
  pagingInfo?: PagingInputArgs;
  includes: IncludeNode[];
  depth: number;
  extensions?: unknown;
  staticCost?: number;
  actualRows?: number;
};

export type IncludeNode = {
  path: string;
  includeName: string;
  modelName: string;
  kind: 'single' | 'many';
  selectAll: boolean;
  selectKeys: string[];
  query: unknown;
  includes: IncludeNode[];
  depth: number;
  extensions?: unknown;
  staticCost?: number;
  actualRows?: number;
};

export type QueryPlan = {
  kind: 'query';
  nodes: QueryNode[];
  totalNodes: number;
  maxDepth: number;
  staticCost?: number;
  actualCost?: number;
};

export type MutationPlan = {
  kind: 'mutation';
  entries: Array<{
    mutationName: string;
    inputBytes: number;
    input: unknown;
    extensions?: unknown;
    staticCost?: number;
  }>;
  staticCost?: number;
};

type ModelRecord = Record<string, Model<any, any, any, any, any, any, any, any>>;

export type SchemaIndexes = ReturnType<typeof buildSchemaIndexes>;

export const buildSchemaIndexes = (schema: Schema<any, any>) => {
  const models: ModelRecord = {};
  const querySingles: Record<string, QuerySingle<any, any, any, any, any>> = {};
  const queryManys: Record<string, QueryMany<any, any, any, any>> = {};
  const queryTypes: Record<string, 'single' | 'many'> = {};
  const includeSingles: Record<string, Record<string, IncludeSingle<any, any, any, any, any, any, any>>> = {};
  const includeManys: Record<string, Record<string, IncludeMany<any, any, any, any, any, any>>> = {};
  const includeTypes: Record<string, 'single' | 'many'> = {};
  const mutations: Record<string, Mutation<any, any, any>> = {};

  for (const modelName of Object.keys(schema.models)) {
    const model = schema.models[modelName] as Model<any, any, any, any, any, any, any, any>;

    models[modelName] = model;

    for (const { queryName, querySingle } of model.getQuerySingles()) {
      querySingles[queryName] = querySingle;
      queryTypes[queryName] = 'single';
    }

    for (const { queryName, queryMany } of model.getQueryManys()) {
      queryManys[queryName] = queryMany;
      queryTypes[queryName] = 'many';
    }

    for (const { includeName, includeSingle } of model.getIncludeSingles()) {
      includeSingles[modelName] ??= {};
      includeSingles[modelName][includeName] = includeSingle;
      includeTypes[getIncludeKey(modelName, includeName)] = 'single';
    }

    for (const { includeName, includeMany } of model.getIncludeManys()) {
      includeManys[modelName] ??= {};
      includeManys[modelName][includeName] = includeMany;
      includeTypes[getIncludeKey(modelName, includeName)] = 'many';
    }
  }

  for (const mutationName of Object.keys(schema.mutations)) {
    mutations[mutationName] = schema.mutations[mutationName] as Mutation<any, any, any>;
  }

  return {
    models,
    querySingles,
    queryManys,
    queryTypes,
    includeSingles,
    includeManys,
    includeTypes,
    mutations,
  };
};

export const buildQueryPlan = (options: { schema: Schema<any, any>; query: unknown }): QueryPlan => {
  const indexes = buildSchemaIndexes(options.schema);
  const queryInput = asRecord(options.query);
  const nodes: QueryNode[] = [];

  let totalNodes = 0;

  let maxDepth = 0;

  for (const queryName of Object.keys(queryInput)) {
    const raw = asRecord(queryInput[queryName]);

    const kind = indexes.queryTypes[queryName];

    if (kind === 'single') {
      const querySingle = indexes.querySingles[queryName];

      if (!querySingle) {
        throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, { queryName });
      }

      const parsed = parseResolverQuery({
        schema: querySingle.getOptions().query,
        value: raw.query,
        queryName,
      });

      const modelName = querySingle.getModelName() as string;

      const includes = buildIncludeNodes({
        indexes,
        parentModelName: modelName,
        parentPath: queryName,
        includeInput: raw.include,
        depth: 1,
      });

      const node = makeQueryNode({
        path: queryName,
        queryName,
        modelName,
        kind,
        rawSelect: raw.select,
        query: parsed,
        includes,
        depth: 0,
        extensions: querySingle.getExtensions(),
      });

      nodes.push(node);
    } else if (kind === 'many') {
      const queryMany = indexes.queryManys[queryName];

      if (!queryMany) {
        throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, { queryName });
      }

      const parsed = parseResolverQuery({
        schema: queryMany.getOptions().query,
        value: raw.query,
        queryName,
      });

      const pagingInfo = queryMany.isPaginated() ? parsePagingInfo({ queryMany, value: raw.pagingInfo, queryName }) : undefined;

      const modelName = queryMany.getModelName() as string;

      const includes = buildIncludeNodes({
        indexes,
        parentModelName: modelName,
        parentPath: queryName,
        includeInput: raw.include,
        depth: 1,
      });

      const node = makeQueryNode({
        path: queryName,
        queryName,
        modelName,
        kind,
        rawSelect: raw.select,
        query: parsed,
        pagingInfo,
        includes,
        depth: 0,
        extensions: queryMany.getExtensions(),
      });

      nodes.push(node);
    } else {
      throw new TQLServerError(TQLServerErrorType.QueryNotFoundError, { queryName });
    }
  }

  const visit = (node: QueryNode | IncludeNode) => {
    totalNodes += 1;
    maxDepth = Math.max(maxDepth, node.depth);
    for (const include of node.includes) visit(include);
  };

  for (const node of nodes) visit(node);

  return { kind: 'query', nodes, totalNodes, maxDepth };
};

export const buildMutationPlan = (options: { schema: Schema<any, any>; mutation: unknown }): MutationPlan => {
  const indexes = buildSchemaIndexes(options.schema);

  const mutationInput = asRecord(options.mutation);

  return {
    kind: 'mutation',
    entries: Object.keys(mutationInput).map((mutationName) => {
      const mutation = indexes.mutations[mutationName];

      if (!mutation) {
        throw new TQLServerError(TQLServerErrorType.MutationNotFoundError, { mutationName });
      }

      const input = asRecord(mutationInput[mutationName]).input;

      return {
        mutationName,
        input,
        inputBytes: byteLength(input),
        extensions: mutation.getExtensions(),
      };
    }),
  };
};

const buildIncludeNodes = (options: {
  indexes: SchemaIndexes;
  parentModelName: string;
  parentPath: string;
  includeInput: unknown;
  depth: number;
}): IncludeNode[] => {
  const { indexes, parentModelName, parentPath, includeInput, depth } = options;

  if (!includeInput || typeof includeInput !== 'object' || Array.isArray(includeInput)) {
    return [];
  }

  return Object.keys(includeInput as Record<string, unknown>).map((includeName) => {
    const raw = asRecord((includeInput as Record<string, unknown>)[includeName]);

    const includeType = indexes.includeTypes[getIncludeKey(parentModelName, includeName)];

    const path = `${parentPath}.include.${includeName}`;

    if (includeType === 'single') {
      const includeSingle = indexes.includeSingles[parentModelName]?.[includeName];

      if (!includeSingle) {
        throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, { modelName: parentModelName, includeName });
      }

      const relationModelName = includeSingle.getRelationName() as string;

      return makeIncludeNode({
        path,
        includeName,
        modelName: relationModelName,
        kind: includeType,
        rawSelect: raw.select,
        query: parseResolverQuery({ schema: includeSingle.getOptions().query, value: raw.query, queryName: path }),
        includes: buildIncludeNodes({
          indexes,
          parentModelName: relationModelName,
          parentPath: path,
          includeInput: raw.include,
          depth: depth + 1,
        }),
        depth,
        extensions: includeSingle.getExtensions(),
      });
    }

    if (includeType === 'many') {
      const includeMany = indexes.includeManys[parentModelName]?.[includeName];

      if (!includeMany) {
        throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, { modelName: parentModelName, includeName });
      }

      const relationModelName = includeMany.getRelationName() as string;

      return makeIncludeNode({
        path,
        includeName,
        modelName: relationModelName,
        kind: includeType,
        rawSelect: raw.select,
        query: parseResolverQuery({ schema: includeMany.getOptions().query, value: raw.query, queryName: path }),
        includes: buildIncludeNodes({
          indexes,
          parentModelName: relationModelName,
          parentPath: path,
          includeInput: raw.include,
          depth: depth + 1,
        }),
        depth,
        extensions: includeMany.getExtensions(),
      });
    }

    throw new TQLServerError(TQLServerErrorType.QueryIncludeNotFoundError, { modelName: parentModelName, includeName });
  });
};

const makeQueryNode = (input: Omit<QueryNode, 'selectAll' | 'selectKeys'> & { rawSelect: unknown }): QueryNode => {
  const { selectAll, selectKeys } = extractSelect(input.rawSelect);

  return {
    ...input,
    selectAll,
    selectKeys,
  };
};

const makeIncludeNode = (input: Omit<IncludeNode, 'selectAll' | 'selectKeys'> & { rawSelect: unknown }): IncludeNode => {
  const { selectAll, selectKeys } = extractSelect(input.rawSelect);

  return {
    ...input,
    selectAll,
    selectKeys,
  };
};

const parseResolverQuery = (options: { schema: z.ZodTypeAny | undefined; value: unknown; queryName: string }): unknown => {
  const schema = options.schema ?? z.object({});
  const value = options.value ?? {};
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new TQLServerError(TQLServerErrorType.QueryInputSchemaValidationError, {
      queryName: options.queryName,
      message: parsed.error.message,
    });
  }

  return parsed.data;
};

const parsePagingInfo = (options: { queryMany: QueryMany<any, any, any, any>; value: unknown; queryName: string }): PagingInputArgs => {
  const parsed = options.queryMany.getPagingInputSchema().safeParse(options.value);

  if (!parsed.success) {
    throw new TQLServerError(TQLServerErrorType.QueryInputSchemaValidationError, {
      queryName: options.queryName,
      message: parsed.error.message,
    });
  }

  return parsed.data;
};

const extractSelect = (select: unknown): { selectAll: boolean; selectKeys: string[] } => {
  if (select === true) {
    return { selectAll: true, selectKeys: [] };
  }

  if (!select || typeof select !== 'object' || Array.isArray(select)) {
    return { selectAll: false, selectKeys: [] };
  }

  return {
    selectAll: false,
    selectKeys: Object.keys(select as Record<string, unknown>).filter((key) => Boolean((select as Record<string, unknown>)[key])),
  };
};

const asRecord = (value: unknown): Record<string, any> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, any>;
};

const byteLength = (value: unknown): number => {
  return Buffer.byteLength(JSON.stringify(value ?? null), 'utf8');
};

const getIncludeKey = (modelName: string, includeName: string) => `${modelName}-${includeName}`;
