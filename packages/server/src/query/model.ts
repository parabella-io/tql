import { z } from 'zod';

import { Field, FieldConstructor } from './field.js';
import { ExternalField, externalField } from './external-field.js';
import { QuerySingle } from './query-single.js';
import type { QuerySingleOptions } from './query-single.js';
import { QueryMany } from './query-many.js';
import type { QueryManyOptions, QueryManyOptionsNonPaginated, QueryManyOptionsPaginated } from './query-many.js';
import { ExtractEntityShape } from '../extract-entity-shape.js';
import { IncludeSingle, IncludeSingleOptions } from './include-single.js';
import { IncludeMany, IncludeManyOptions } from './include-many.js';

type QuerySingleFn<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  <QueryArgs extends Record<string, any>>(
    options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, false>,
  ): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, false>;

  <QueryArgs extends Record<string, any>>(
    options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, true> & { nullable: true },
  ): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, true>;
};

type QueryManyFn<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  <QueryArgs extends Record<string, any>>(
    options: QueryManyOptionsPaginated<SchemaContext, SchemaEntities, ModelName, QueryArgs>,
  ): QueryMany<SchemaContext, SchemaEntities, ModelName, QueryArgs>;

  <QueryArgs extends Record<string, any>>(
    options: QueryManyOptionsNonPaginated<SchemaContext, SchemaEntities, ModelName, QueryArgs>,
  ): QueryMany<SchemaContext, SchemaEntities, ModelName, QueryArgs>;
};

type IncludeSingleFn<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  <RelationName extends keyof SchemaEntities & string, QueryArgs extends Record<string, any> = {}, const MatchKey extends string = never>(
    relationName: RelationName,
    options: IncludeSingleOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, false, MatchKey>,
  ): IncludeSingle<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, false, MatchKey>;

  <RelationName extends keyof SchemaEntities & string, QueryArgs extends Record<string, any> = {}, const MatchKey extends string = never>(
    relationName: RelationName,
    options: IncludeSingleOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, true, MatchKey> & { nullable: true },
  ): IncludeSingle<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, true, MatchKey>;
};

type IncludeManyFn<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  <RelationName extends keyof SchemaEntities & string, QueryArgs extends Record<string, any> = {}, const MatchKey extends string = never>(
    relationName: RelationName,
    options: IncludeManyOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, MatchKey>,
  ): IncludeMany<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, MatchKey>;
};

export type ExternalFieldsHelpers<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  externalField: typeof externalField;
};

export type QueryHelpers<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  querySingle: QuerySingleFn<SchemaContext, SchemaEntities, ModelName>;

  queryMany: QueryManyFn<SchemaContext, SchemaEntities, ModelName>;
};

export type IncludeHelpers<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  includeSingle: IncludeSingleFn<SchemaContext, SchemaEntities, ModelName>;

  includeMany: IncludeManyFn<SchemaContext, SchemaEntities, ModelName>;
};

export type IncludesMap<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = Record<
  string,
  // Note: keep Nullable generic as `any` so per-include literals (true/false) are preserved on concrete model include maps
  // Allow any QueryArgs that extends Record<string, any> to preserve specific query types
  // The relation name and matchKey are kept as broad unions here, but will be narrowed when extracting from specific includes
  | IncludeSingle<SchemaContext, SchemaEntities, ModelName, keyof SchemaEntities & string, any, any, string>
  | IncludeMany<SchemaContext, SchemaEntities, ModelName, keyof SchemaEntities & string, any, string>
>;

export type ModelExternalFieldsMap<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = Record<string, ExternalField<SchemaContext, SchemaEntities, ModelName, any>>;

export type ModelConstructor<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  ModelSchema extends z.ZodObject<{
    [K in keyof ExtractEntityShape<SchemaEntities, ModelName>]: z.ZodType<ExtractEntityShape<SchemaEntities, ModelName>[K]>;
  }>,
  ModelFields extends Record<string, Field<SchemaContext, SchemaEntities, ModelName>>,
  ModelQueries extends Record<string, any>,
  ModelIncludes extends IncludesMap<SchemaContext, SchemaEntities, ModelName>,
  ModelExternalFields extends ModelExternalFieldsMap<SchemaContext, SchemaEntities, ModelName> = Record<string, never>,
> = {
  schema: ModelSchema;
  allowEach?: (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean;
  fields: ({
    field,
  }: {
    field: (options?: FieldConstructor<SchemaContext, SchemaEntities, ModelName>) => Field<SchemaContext, SchemaEntities, ModelName>;
  }) => ModelFields;
  externalFields?: (helpers: ExternalFieldsHelpers<SchemaContext, SchemaEntities, ModelName>) => ModelExternalFields;
  queries: (options: QueryHelpers<SchemaContext, SchemaEntities, ModelName>) => ModelQueries;
  includes?: (options: IncludeHelpers<SchemaContext, SchemaEntities, ModelName>) => ModelIncludes;
};

export class Model<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  ModelSchema extends z.ZodObject<{
    [K in keyof ExtractEntityShape<SchemaEntities, ModelName>]: z.ZodType<ExtractEntityShape<SchemaEntities, ModelName>[K]>;
  }>,
  ModelFields extends Record<string, Field<SchemaContext, SchemaEntities, ModelName>>,
  ModelQueries extends Record<string, any>,
  ModelIncludes extends IncludesMap<SchemaContext, SchemaEntities, ModelName> = {},
  ModelExternalFields extends ModelExternalFieldsMap<SchemaContext, SchemaEntities, ModelName> = Record<string, never>,
> {
  modelName: ModelName;

  schema: ModelSchema;

  allowEach?: (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean;

  fields: ModelFields;

  externalFields: ModelExternalFields;

  queries?: ModelQueries;

  includes?: ModelIncludes;

  constructor(
    modelName: ModelName,
    options: ModelConstructor<
      SchemaContext,
      SchemaEntities,
      ModelName,
      ModelSchema,
      ModelFields,
      ModelQueries,
      ModelIncludes,
      ModelExternalFields
    >,
  ) {
    this.modelName = modelName;

    this.schema = options.schema;

    this.allowEach = options.allowEach;

    const field = (opts?: FieldConstructor<SchemaContext, SchemaEntities, ModelName>) => {
      const f = new Field<SchemaContext, SchemaEntities, ModelName>();
      if (opts?.allow) {
        f.allow = opts.allow;
      }
      return f;
    };

    this.fields = options.fields({ field });

    this.externalFields = (options.externalFields?.({ externalField }) ?? {}) as ModelExternalFields;

    const querySingle = ((opts: any) => new QuerySingle(modelName as any, opts)) as QuerySingleFn<SchemaContext, SchemaEntities, ModelName>;

    const queryMany = ((opts: any) => new QueryMany(modelName as any, opts)) as QueryManyFn<SchemaContext, SchemaEntities, ModelName>;

    const includeSingle = ((relationName: any, includeOpts: any) =>
      new IncludeSingle(modelName, relationName, includeOpts)) as IncludeSingleFn<SchemaContext, SchemaEntities, ModelName>;

    const includeMany = ((relationName: any, includeOpts: any) => new IncludeMany(modelName, relationName, includeOpts)) as IncludeManyFn<
      SchemaContext,
      SchemaEntities,
      ModelName
    >;

    this.queries = options?.queries?.({
      querySingle,
      queryMany,
    });

    this.includes = options?.includes?.({ includeSingle, includeMany });
  }

  public getSchema(): z.ZodObject {
    return this.schema;
  }

  public getAllowEach(): (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean {
    return this.allowEach || (() => true);
  }

  public getExternalFields(): ModelExternalFields {
    return this.externalFields;
  }

  public getExternalFieldKeys(): string[] {
    return Object.keys(this.externalFields ?? {});
  }

  public getQuerySingles(): GetQuerySingles<SchemaContext, SchemaEntities, ModelName>[] {
    const querySingles = [];

    for (const queryName of Object.keys(this.queries || {})) {
      const query = this.queries?.[queryName];

      if (query && query instanceof QuerySingle) {
        querySingles.push({
          queryName: queryName,
          querySingle: query,
        });
      }
    }

    return querySingles;
  }

  public getQueryManys(): GetQueryManys<SchemaContext, SchemaEntities, ModelName>[] {
    const queryManyes = [];

    for (const queryName of Object.keys(this.queries || {})) {
      const query = this.queries?.[queryName];

      if (query && query instanceof QueryMany) {
        queryManyes.push({
          queryName: queryName,
          queryMany: query,
        });
      }
    }

    return queryManyes;
  }

  public getIncludeSingles(): GetIncludeSingles<SchemaContext, SchemaEntities, ModelName>[] {
    const includeSingles = [];

    for (const includeName of Object.keys(this.includes || {})) {
      const include = this.includes?.[includeName];

      if (include && include instanceof IncludeSingle) {
        includeSingles.push({
          includeName: includeName,
          includeRelationName: include.getRelationName(),
          includeSingle: include,
        });
      }
    }

    return includeSingles;
  }

  public getIncludeManys(): GetIncludeManys<SchemaContext, SchemaEntities, ModelName>[] {
    const includeManys = [];

    for (const includeName of Object.keys(this.includes || {})) {
      const include = this.includes?.[includeName];

      if (include && include instanceof IncludeMany) {
        includeManys.push({
          includeName: includeName,
          includeRelationName: include.getRelationName(),
          includeMany: include,
        });
      }
    }

    return includeManys;
  }
}

export type GetQuerySingles<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  queryName: string;
  querySingle: QuerySingle<SchemaContext, SchemaEntities, ModelName, any, any>;
};

export type GetQueryManys<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  queryName: string;
  queryMany: QueryMany<SchemaContext, SchemaEntities, ModelName, any>;
};

export type GetIncludeSingles<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  includeName: string;
  includeRelationName: string;
  includeSingle: IncludeSingle<SchemaContext, SchemaEntities, ModelName, keyof SchemaEntities & string, Record<string, any>, any, string>;
};

export type GetIncludeManys<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  includeName: string;
  includeRelationName: string;
  includeMany: IncludeMany<SchemaContext, SchemaEntities, ModelName, keyof SchemaEntities & string, Record<string, any>, string>;
};
