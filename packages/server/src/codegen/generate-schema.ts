import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type { ZodObject, ZodTypeAny } from 'zod';

import { Mutation } from '../mutation/mutation.js';
import { Model } from '../query/model.js';
import { IncludeMany } from '../query/include-many.js';
import { IncludeSingle } from '../query/include-single.js';
import { QueryMany } from '../query/query-many.js';
import { QuerySingle } from '../query/query-single.js';
import { Schema } from '../schema.js';

type GenerateSchemaOptions = {
  schema: Schema<any, any>;
  outputPath: string;
};

export type GenerateSchemaTimings = {
  /** Wall-clock time spent rendering the TS source from the schema, in ms. */
  renderMs: number;
  /** Wall-clock time spent reading + comparing the existing file, in ms. */
  diffMs: number;
  /** Wall-clock time spent writing the file (0 when unchanged), in ms. */
  writeMs: number;
  /** Total time spent inside `generateSchema`, in ms. */
  totalMs: number;
};

export type GenerateSchemaResult =
  | { written: true; reason: 'created' | 'changed'; hash: string; outputPath: string; timings: GenerateSchemaTimings }
  | { written: false; reason: 'unchanged'; hash: string; outputPath: string; timings: GenerateSchemaTimings };

const HASH_MARKER = '// @schema-hash';

/**
 * Emits a hand-written-style schema module for the given {@link Schema}
 * instance. The output combines the previous query-schema and mutation-schema
 * generators into a single self-contained file with shared entity declarations.
 *
 * Layout:
 *   1. Core helpers                     query + mutation projection helpers
 *   2. Entity interfaces                one per registered model
 *   3. ExternalFields types             per-model value map for batch external fields
 *   4. EntityByName                     name -> entity lookup (mutation projection)
 *   5. <Model>Select / SelectMap        entity scalars + external scalars
 *   6. Include nodes                    one named interface per (parent, include)
 *   7. <Model>IncludeMap                map of relation -> include node
 *   8. <Query>Input + QueryInputMap     per-query envelopes and aggregate map
 *   9. QueryRegistry                    queryName -> { entity, kind, nullable, includeMap, externalFieldKeys, externalFields }
 *  10. <Mutation>Input + MutationInputMap per-mutation envelopes and aggregate map
 *  11. MutationRegistry                 mutationName -> declared `changed` map
 *  12. ClientSchema                     aggregate map consumed by @tql/client
 *  13. Projection + handle stubs        cheap mapped types + type-only entry points
 *
 * Recursion is by name so deep selections / mutation `changed` projections
 * resolve in roughly O(1) instead of walking the deep `FlattenedQueriesInput`
 * / `FlattenedMutationsInput` generic chains at runtime.
 */
export const generateSchema = (options: GenerateSchemaOptions): GenerateSchemaResult => {
  const { schema, outputPath } = options;

  const startedAt = performance.now();

  const renderStart = performance.now();
  const body = renderSchemaSource(schema);
  const hash = hashSource(body);
  const source = `${HASH_MARKER} ${hash}\n${body}`;
  const renderMs = performance.now() - renderStart;

  const diffStart = performance.now();
  const existing = readFileIfExists(outputPath);
  const existingHash = existing !== null ? extractHash(existing) : null;
  const diffMs = performance.now() - diffStart;

  if (existing !== null && existingHash === hash) {
    const timings: GenerateSchemaTimings = {
      renderMs,
      diffMs,
      writeMs: 0,
      totalMs: performance.now() - startedAt,
    };

    return { written: false, reason: 'unchanged', hash, outputPath, timings };
  }

  const writeStart = performance.now();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, source, 'utf8');
  const writeMs = performance.now() - writeStart;

  const timings: GenerateSchemaTimings = {
    renderMs,
    diffMs,
    writeMs,
    totalMs: performance.now() - startedAt,
  };

  return {
    written: true,
    reason: existing === null ? 'created' : 'changed',
    hash,
    outputPath,
    timings,
  };
};

const hashSource = (source: string): string => {
  return createHash('sha256').update(source).digest('hex').slice(0, 16);
};

const readFileIfExists = (path: string): string | null => {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

const extractHash = (source: string): string | null => {
  const firstNewline = source.indexOf('\n');
  const firstLine = firstNewline === -1 ? source : source.slice(0, firstNewline);
  if (!firstLine.startsWith(HASH_MARKER)) {
    return null;
  }
  return firstLine.slice(HASH_MARKER.length).trim() || null;
};

// =============================================================================
// INTROSPECTION
// =============================================================================

type ModelInfo = {
  modelName: string;
  pascalName: string;
  schema: ZodObject<any>;
  /** External-only keys with their own Zod schemas (not on `schema.shape`). */
  externalFieldEntries: Array<{ name: string; schema: ZodTypeAny }>;
  querySingles: Array<{ queryName: string; querySingle: QuerySingle<any, any, any, any, any> }>;
  queryManys: Array<{ queryName: string; queryMany: QueryMany<any, any, any, any> }>;
  includeSingles: Array<{ includeName: string; includeSingle: IncludeSingle<any, any, any, any, any, any, any> }>;
  includeManys: Array<{ includeName: string; includeMany: IncludeMany<any, any, any, any, any, any> }>;
};

type ChangedDeclaration = Partial<Record<string, Partial<Record<MutationOpName, true>>>>;

type MutationOpName = 'inserts' | 'updates' | 'upserts' | 'deletes';

type MutationInfo = {
  mutationName: string;
  pascalName: string;
  inputSchema: ZodObject<any>;
  changed: ChangedDeclaration;
};

const MUTATION_OPS: MutationOpName[] = ['inserts', 'updates', 'upserts', 'deletes'];

const collectModels = (schema: Schema<any, any>): ModelInfo[] => {
  return Object.keys(schema.models).map((modelName) => {
    const model = schema.models[modelName] as Model<any, any, any, any, any, any, any, any>;
    const zodSchema = model.getSchema() as ZodObject<any>;
    const shapeKeys = new Set(Object.keys(zodSchema.shape));
    const extMap = model.getExternalFields();
    const externalFieldEntries: Array<{ name: string; schema: ZodTypeAny }> = [];

    for (const key of Object.keys(extMap)) {
      const def = extMap[key];
      const sch = def.getOptions().schema;
      if (shapeKeys.has(key)) {
        throw new Error(
          `[generateSchema] Model "${modelName}" externalField "${key}" must not reuse a key from the model Zod schema; external fields are defined only under externalFields + their own schema.`,
        );
      }
      externalFieldEntries.push({ name: key, schema: sch as ZodTypeAny });
    }

    const fieldKeys = new Set(Object.keys(model.fields ?? {}));
    for (const { name } of externalFieldEntries) {
      if (fieldKeys.has(name)) {
        throw new Error(
          `[generateSchema] Model "${modelName}" externalField "${name}" duplicates a persisted field() key; use only one of fields / externalFields for this key.`,
        );
      }
    }

    return {
      modelName,
      pascalName: toPascalCase(modelName),
      schema: zodSchema,
      externalFieldEntries,
      querySingles: model.getQuerySingles().map((entry) => ({
        queryName: entry.queryName,
        querySingle: entry.querySingle,
      })),
      queryManys: model.getQueryManys().map((entry) => ({
        queryName: entry.queryName,
        queryMany: entry.queryMany,
      })),
      includeSingles: model.getIncludeSingles().map((entry) => ({
        includeName: entry.includeName,
        includeSingle: entry.includeSingle,
      })),
      includeManys: model.getIncludeManys().map((entry) => ({
        includeName: entry.includeName,
        includeMany: entry.includeMany,
      })),
    };
  });
};

const collectMutations = (schema: Schema<any, any>): MutationInfo[] => {
  return Object.keys(schema.mutations).map((mutationName) => {
    const mutation = schema.mutations[mutationName] as Mutation<any, any, any, any>;
    return {
      mutationName,
      pascalName: toPascalCase(mutationName),
      inputSchema: mutation.getInputSchema() as ZodObject<any>,
      changed: (mutation.getChanged() ?? {}) as ChangedDeclaration,
    };
  });
};

const hasIncludes = (model: ModelInfo): boolean => model.includeSingles.length > 0 || model.includeManys.length > 0;

// =============================================================================
// RENDERING
// =============================================================================

const renderSchemaSource = (schema: Schema<any, any>): string => {
  const models = collectModels(schema);
  const mutations = collectMutations(schema);

  const sections = [
    HEADER_COMMENT,
    renderEntitiesSection(models),
    renderExternalFieldsTypesSection(models),
    renderEntityByName(models),
    renderSelectsSection(models),
    renderIncludeNodesSection(models),
    renderIncludeMapsSection(models),
    renderQueryInputsSection(models),
    renderQueryInputMap(models),
    renderQueryRegistry(models),
    renderMutationInputsSection(mutations),
    renderMutationInputMap(mutations),
    renderMutationRegistry(mutations),
    QUERY_PROJECTION_BLOCK,
    MUTATION_PROJECTION_BLOCK,
    CLIENT_SCHEMA_BLOCK,
  ];

  return sections.filter((section) => section.length > 0).join('\n\n') + '\n';
};

const renderEntitiesSection = (models: ModelInfo[]): string => {
  const blocks = models.map((model) => renderEntity(model));
  return [bannerComment('ENTITY SHAPES'), ...blocks].join('\n\n');
};

const renderEntity = (model: ModelInfo): string => {
  const fields = renderObjectShapeLines(model.schema, '  ');
  const lines = [`export interface ${model.pascalName}Entity {`, ...fields, `  __model: '${model.modelName}';`, `}`];
  return lines.join('\n');
};

const renderExternalFieldsTypesSection = (models: ModelInfo[]): string => {
  const blocks = models.map((model) => {
    if (model.externalFieldEntries.length === 0) {
      return `export type ${model.pascalName}ExternalFields = Record<never, never>;`;
    }
    const lines = model.externalFieldEntries.map(({ name, schema }) => `  ${name}: ${zodToTs(schema, '  ')};`);
    return [`export interface ${model.pascalName}ExternalFields {`, ...lines, `}`].join('\n');
  });

  return [bannerComment('EXTERNAL FIELD VALUE TYPES (not part of Entity / model Zod schema)'), ...blocks].join('\n\n');
};

const renderEntityByName = (models: ModelInfo[]): string => {
  const lines = ['export interface SchemaEntities {'];
  for (const model of models) {
    lines.push(`  ${model.modelName}: ${model.pascalName}Entity;`);
  }
  lines.push('}');

  return [bannerComment('ENTITY BY NAME (drives mutation response projection without distributing over a union)'), lines.join('\n')].join(
    '\n\n',
  );
};

const renderSelectsSection = (models: ModelInfo[]): string => {
  const blocks = models.map((model) => {
    const scalar = `type ${model.pascalName}ScalarSelectMap = { [K in Exclude<keyof ${model.pascalName}Entity, '__model'>]?: true };`;
    const ext = `type ${model.pascalName}ExternalSelectMap = { [K in keyof ${model.pascalName}ExternalFields]?: true };`;
    const selectMap = `type ${model.pascalName}SelectMap = ${model.pascalName}ScalarSelectMap & ${model.pascalName}ExternalSelectMap;`;
    const select = `type ${model.pascalName}Select = true | ${model.pascalName}SelectMap;`;
    return [scalar, ext, selectMap, select].join('\n');
  });

  return [bannerComment('PER-MODEL SELECT SHAPES (entity scalars + external field scalars)'), ...blocks].join('\n\n');
};

const renderIncludeNodesSection = (models: ModelInfo[]): string => {
  const blocks: string[] = [];

  for (const parentModel of models) {
    for (const { includeName, includeSingle } of parentModel.includeSingles) {
      blocks.push(renderIncludeNode(parentModel, includeName, includeSingle, models));
    }
    for (const { includeName, includeMany } of parentModel.includeManys) {
      blocks.push(renderIncludeNode(parentModel, includeName, includeMany, models));
    }
  }

  if (blocks.length === 0) {
    return '';
  }

  return [bannerComment('INCLUDE NODES (one named interface per parent x include relation)'), ...blocks].join('\n\n');
};

const renderIncludeNode = (
  parentModel: ModelInfo,
  includeName: string,
  include: IncludeSingle<any, any, any, any, any, any, any> | IncludeMany<any, any, any, any, any, any>,
  models: ModelInfo[],
): string => {
  const interfaceName = includeNodeInterfaceName(parentModel.modelName, includeName);
  const targetModelName = include.getRelationName();
  const target = findModel(models, targetModelName);
  const targetPascal = target ? target.pascalName : toPascalCase(targetModelName);

  let kind: 'single' | 'singleNullable' | 'many';
  if (include instanceof IncludeMany) {
    kind = 'many';
  } else if (include.isNullable()) {
    kind = 'singleNullable';
  } else {
    kind = 'single';
  }

  const querySchema = include.getOptions().query as ZodTypeAny | undefined;
  const lines: string[] = [];
  lines.push(`interface ${interfaceName} extends IncludeNodeMarker<'${kind}', ${targetPascal}Entity> {`);

  if (querySchema) {
    lines.push(`  query: ${zodToTs(querySchema, '  ')};`);
  }

  lines.push(`  select: ${targetPascal}Select;`);

  if (target && hasIncludes(target)) {
    lines.push(`  include?: ${targetPascal}IncludeMap;`);
  }

  lines.push(`}`);

  return lines.join('\n');
};

const renderIncludeMapsSection = (models: ModelInfo[]): string => {
  const blocks: string[] = [];

  for (const model of models) {
    if (!hasIncludes(model)) continue;

    const lines = [`interface ${model.pascalName}IncludeMap {`];

    for (const { includeName } of model.includeSingles) {
      lines.push(`  ${includeName}?: ${includeNodeInterfaceName(model.modelName, includeName)};`);
    }
    for (const { includeName } of model.includeManys) {
      lines.push(`  ${includeName}?: ${includeNodeInterfaceName(model.modelName, includeName)};`);
    }

    lines.push(`}`);
    blocks.push(lines.join('\n'));
  }

  if (blocks.length === 0) {
    return '';
  }

  return [bannerComment('PER-MODEL INCLUDE MAPS'), ...blocks].join('\n\n');
};

const renderQueryInputsSection = (models: ModelInfo[]): string => {
  const blocks: string[] = [];

  for (const model of models) {
    if (model.querySingles.length === 0 && model.queryManys.length === 0) {
      continue;
    }

    const queryBlocks: string[] = [];
    queryBlocks.push(`// ---- ${model.modelName} ----`);

    for (const { queryName, querySingle } of model.querySingles) {
      queryBlocks.push(renderQueryInput(queryName, model, querySingle.getOptions().query as ZodTypeAny | undefined));
    }
    for (const { queryName, queryMany } of model.queryManys) {
      queryBlocks.push(renderQueryInput(queryName, model, queryMany.getOptions().query as ZodTypeAny | undefined));
    }

    blocks.push(queryBlocks.join('\n\n'));
  }

  if (blocks.length === 0) {
    return '';
  }

  return [bannerComment('PER-QUERY INPUT INTERFACES'), ...blocks].join('\n\n');
};

const renderQueryInput = (queryName: string, model: ModelInfo, querySchema: ZodTypeAny | undefined): string => {
  const interfaceName = `${toPascalCase(queryName)}Input`;
  const queryType = querySchema ? zodToTs(querySchema, '  ') : '{}';

  const lines = [`export interface ${interfaceName} {`, `  query: ${queryType};`, `  select: ${model.pascalName}Select;`];

  if (hasIncludes(model)) {
    lines.push(`  include?: ${model.pascalName}IncludeMap;`);
  }

  lines.push(`}`);
  return lines.join('\n');
};

const renderQueryInputMap = (models: ModelInfo[]): string => {
  const entries: string[] = [];

  for (const model of models) {
    for (const { queryName } of model.querySingles) {
      entries.push(`  ${queryName}: ${toPascalCase(queryName)}Input;`);
    }
    for (const { queryName } of model.queryManys) {
      entries.push(`  ${queryName}: ${toPascalCase(queryName)}Input;`);
    }
  }

  const body = ['export interface QueryInputMap {', ...entries, '}'].join('\n');
  return [bannerComment('AGGREGATE QUERY INPUT MAP'), body].join('\n\n');
};

const renderExternalFieldKeysLiteral = (keys: string[]): string => {
  if (keys.length === 0) {
    return 'readonly []';
  }
  return `readonly [${keys.map((k) => JSON.stringify(k)).join(', ')}]`;
};

const renderQueryRegistry = (models: ModelInfo[]): string => {
  const entries: string[] = [];

  for (const model of models) {
    const includeMapType = hasIncludes(model) ? `${model.pascalName}IncludeMap` : 'never';
    const extKeys = model.externalFieldEntries.map((e) => e.name);
    const externalFieldKeysType = renderExternalFieldKeysLiteral(extKeys);

    for (const { queryName, querySingle } of model.querySingles) {
      const nullable = querySingle.isNullable() ? 'true' : 'false';
      entries.push(
        `  ${queryName}: { entity: ${model.pascalName}Entity; kind: 'single'; nullable: ${nullable}; includeMap: ${includeMapType}; externalFieldKeys: ${externalFieldKeysType}; externalFields: ${model.pascalName}ExternalFields };`,
      );
    }
    for (const { queryName } of model.queryManys) {
      entries.push(
        `  ${queryName}: { entity: ${model.pascalName}Entity; kind: 'many'; nullable: false; includeMap: ${includeMapType}; externalFieldKeys: ${externalFieldKeysType}; externalFields: ${model.pascalName}ExternalFields };`,
      );
    }
  }

  const body = ['export interface QueryRegistry {', ...entries, '}'].join('\n');
  return [bannerComment('QUERY REGISTRY (entity + arity + nullability + include map + externalFieldKeys + externalFields)'), body].join(
    '\n\n',
  );
};

const renderMutationInputsSection = (mutations: MutationInfo[]): string => {
  if (mutations.length === 0) return '';

  const blocks = mutations.map((mutation) => renderMutationInput(mutation));

  return [bannerComment('PER-MUTATION INPUT INTERFACES'), ...blocks].join('\n\n');
};

const renderMutationInput = (mutation: MutationInfo): string => {
  const dataInterfaceName = `${mutation.pascalName}InputData`;
  const inputInterfaceName = `${mutation.pascalName}Input`;

  const dataLines = [`interface ${dataInterfaceName} {`, ...renderObjectShapeLines(mutation.inputSchema, '  '), `}`];
  const inputLines = [`export interface ${inputInterfaceName} {`, `  input: ${dataInterfaceName};`, `}`];

  return [dataLines.join('\n'), inputLines.join('\n')].join('\n');
};

const renderMutationInputMap = (mutations: MutationInfo[]): string => {
  if (mutations.length === 0) return '';

  const entries = mutations.map((mutation) => `  ${mutation.mutationName}: ${mutation.pascalName}Input;`);
  const body = ['export interface MutationInputMap {', ...entries, '}'].join('\n');
  return [bannerComment('AGGREGATE MUTATION INPUT MAP'), body].join('\n\n');
};

const renderMutationRegistry = (mutations: MutationInfo[]): string => {
  if (mutations.length === 0) return '';

  const entries = mutations.map((mutation) => `  ${mutation.mutationName}: ${renderChangedLiteral(mutation.changed)};`);
  const body = ['export interface MutationRegistry {', ...entries, '}'].join('\n');
  return [bannerComment('MUTATION REGISTRY (literal `changed` map per mutation)'), body].join('\n\n');
};

const renderChangedLiteral = (changed: ChangedDeclaration): string => {
  const modelKeys = Object.keys(changed);
  if (modelKeys.length === 0) return '{}';

  const parts: string[] = [];
  for (const modelName of modelKeys) {
    const ops = changed[modelName] ?? {};
    const opEntries = MUTATION_OPS.filter((op) => ops[op] === true).map((op) => `${op}: true`);
    parts.push(`${modelName}: { ${opEntries.join('; ')} }`);
  }

  return `{ ${parts.join('; ')} }`;
};

// =============================================================================
// ZOD -> TS
// =============================================================================

const renderObjectShapeLines = (schema: ZodObject<any>, indent: string): string[] => {
  const shape = schema.shape as Record<string, ZodTypeAny>;
  const lines: string[] = [];

  for (const key of Object.keys(shape)) {
    const value = shape[key];
    const def = getDef(value);

    if (def?.type === 'optional') {
      lines.push(`${indent}${key}?: ${zodToTs(def.innerType as ZodTypeAny, indent)};`);
    } else {
      lines.push(`${indent}${key}: ${zodToTs(value, indent)};`);
    }
  }

  return lines;
};

const zodToTs = (schema: ZodTypeAny, indent: string): string => {
  const def = getDef(schema);

  if (!def) return 'unknown';

  switch (def.type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'bigint':
      return 'bigint';
    case 'date':
      return 'Date';
    case 'null':
      return 'null';
    case 'undefined':
      return 'undefined';
    case 'any':
      return 'any';
    case 'unknown':
      return 'unknown';
    case 'never':
      return 'never';
    case 'literal': {
      const values = (def.values as unknown[]) ?? [];
      return values.map(formatLiteral).join(' | ') || 'never';
    }
    case 'enum': {
      const entries = (def.entries as Record<string, string | number>) ?? {};
      const values = Object.values(entries);
      return values.map(formatLiteral).join(' | ') || 'never';
    }
    case 'array':
      return `${zodToTs(def.element as ZodTypeAny, indent)}[]`;
    case 'nullable':
      return `${zodToTs(def.innerType as ZodTypeAny, indent)} | null`;
    case 'optional':
      return `${zodToTs(def.innerType as ZodTypeAny, indent)} | undefined`;
    case 'default':
      return zodToTs(def.innerType as ZodTypeAny, indent);
    case 'union': {
      const options = (def.options as ZodTypeAny[]) ?? [];
      return options.map((option) => zodToTs(option, indent)).join(' | ') || 'never';
    }
    case 'object': {
      const lines = renderObjectShapeLines(schema as ZodObject<any>, `${indent}  `);
      if (lines.length === 0) return '{}';
      return `{\n${lines.join('\n')}\n${indent}}`;
    }
    case 'record': {
      const valueType = zodToTs(def.valueType as ZodTypeAny, indent);
      return `Record<string, ${valueType}>`;
    }
    default:
      return 'unknown';
  }
};

const getDef = (schema: ZodTypeAny): any => {
  return (schema as any)?.def ?? (schema as any)?._def;
};

const formatLiteral = (value: unknown): string => {
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null) return 'null';
  return JSON.stringify(value);
};

// =============================================================================
// NAMING / UTILITIES
// =============================================================================

const toPascalCase = (input: string): string => {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
};

const includeNodeInterfaceName = (modelName: string, includeName: string): string => {
  return `${toPascalCase(modelName)}_${toPascalCase(includeName)}_IncludeNode`;
};

const findModel = (models: ModelInfo[], modelName: string): ModelInfo | undefined => {
  return models.find((model) => model.modelName === modelName);
};

const bannerComment = (title: string): string => {
  const rule = '// ' + '='.repeat(75);
  return `${rule}\n// ${title}\n${rule}`;
};

// =============================================================================
// STATIC SOURCE BLOCKS
// =============================================================================

const HEADER_COMMENT = `/**
 * Auto-generated TQL schema — DO NOT EDIT BY HAND.
 *
 * Mirrors the runtime behaviour of QueryResolver.handle and
 * MutationResolver.handle but as named, non-recursive interfaces so TypeScript
 * resolves each query / mutation in near-O(1) instead of walking the deep
 * \`FlattenedQueriesInput\` / \`FlattenedMutationsInput\` generic chains.
 *
 * All projection helpers (\`Selected\`, \`IncludeProjection\`, \`MutationChanges\`,
 * etc.) live in \`@tql/server/shared\` so the codegen output, the server
 * runtime, and \`@tql/client\` all share a single source of truth. The file
 * below only emits schema-specific shapes (entities, selects, includes,
 * inputs, registries, and the aggregate \`ClientSchema\`).
 *
 * Layout:
 *   1. <Model>Entity                    one per registered model, with \`__model\` brand
 *   2. <Model>ExternalFields            value types for external-only batch fields (own Zod per field)
 *   3. SchemaEntities                   name -> entity lookup (mutation projection)
 *   4. <Model>Select / <Model>SelectMap entity scalars + external scalars
 *   5. <Parent>_<Include>_IncludeNode   one named interface per (parent, include) pair
 *   6. <Model>IncludeMap                map of relation-name -> named IncludeNode
 *   7. <Query>Input + QueryInputMap     per-query envelopes (\`query\`, \`select\`, \`include?\`) and aggregate map
 *   8. QueryRegistry                    queryName -> { entity, kind, nullable, includeMap, externalFieldKeys, externalFields }
 *   9. <Mutation>Input + MutationInputMap per-mutation envelopes and aggregate map
 *  10. MutationRegistry                 mutationName -> declared \`changed\` map
 *  11. QueryResponseMap / HandleQueryResponse    aliases over shared helpers
 *  12. MutationResponseMap / HandleMutationResponse aliases over shared helpers
 *  13. ClientSchema                     aggregate map consumed by @tql/client
 *  14. handleQuery / handleMutation     type-only stubs
 */

import type {
  ClientSchema as ClientSchemaConstraint,
  HandleMutationResponseFor,
  HandleQueryResponseFor,
  IncludeNodeMarker,
  MutationResponseMapFor,
  QueryResponseMapFor,
} from '@tql/server/shared';`;

const QUERY_PROJECTION_BLOCK = `${bannerComment('QUERY PROJECTION + RESPONSE')}

/**
 * Fixed per-query response map. Each key returns the *full* entity (no select
 * projection) so it can be referenced by the resolver classes without paying
 * the cost of per-call inference.
 */
export type QueryResponseMap = QueryResponseMapFor<QueryRegistry, QueryInputMap>;

export type HandleQueryResponse<Q extends Partial<QueryInputMap>> = HandleQueryResponseFor<QueryRegistry, QueryInputMap, Q>;`;

const MUTATION_PROJECTION_BLOCK = `${bannerComment('MUTATION PROJECTION + RESPONSE')}

/**
 * Fixed per-mutation response map. Each key resolves to the full
 * \`MutationChangesFromRegistry<MutationRegistry, SchemaEntities, K>\` for
 * that mutation. Resolver classes use this for their bulk return type
 * while preserving per-key projection.
 */
export type MutationResponseMap = MutationResponseMapFor<MutationRegistry, SchemaEntities, MutationInputMap>;

export type HandleMutationResponse<Q extends Partial<MutationInputMap>> = HandleMutationResponseFor<
  MutationRegistry,
  SchemaEntities,
  MutationInputMap,
  Q
>;`;

const CLIENT_SCHEMA_BLOCK = `${bannerComment('CLIENT SCHEMA (single aggregate consumed by @tql/client)')}

/**
 * Aggregate type consumed by \`@tql/client\`. The client is parameterized by a
 * single \`ClientSchema\` so it can index every shape it needs — query inputs,
 * query responses, mutation inputs, mutation responses, entity shapes, and
 * the per-query / per-mutation registries used to project response data from
 * the user's actual \`select\` / \`include\` shape — off one generic instead of
 * duck-typing a resolver class.
 *
 * Satisfies the {@link ClientSchemaConstraint} from \`@tql/server/shared\`.
 */
export interface ClientSchema extends ClientSchemaConstraint {
  QueryInputMap: QueryInputMap;
  QueryResponseMap: QueryResponseMap;
  QueryRegistry: QueryRegistry;
  MutationInputMap: MutationInputMap;
  MutationResponseMap: MutationResponseMap;
  MutationRegistry: MutationRegistry;
  SchemaEntities: SchemaEntities;
}`;
