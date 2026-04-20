import { z } from 'zod';

import { Field, FieldConstructor } from './field.js';
import { QuerySingle } from './query-single.js';
import type { QuerySingleOptions } from './query-single.js';
import { QueryMany } from './query-many.js';
import type { QueryManyOptions } from './query-many.js';
import { ExtractEntityShape } from '../extract-entity-shape.js';
import { IncludeSingle, IncludeSingleOptions } from './include-single.js';
import { IncludeMany, IncludeManyOptions } from './include-many.js';
import type { EnforceQueryManyMetadata, QueryManyMetadataMap } from './query-many.js';
import type { EnforceQuerySingleMetadata, QuerySingleMetadataMap } from './query-single.js';

type QueryMetadataFn<SchemaContext extends Record<string, any>, QueryArgs extends Record<string, any> = any> = {
  <ReturnType, Schema extends z.ZodType<ReturnType>>(def: {
    schema: Schema;
    resolve: (options: { context: SchemaContext; query: QueryArgs }) => ReturnType | Promise<ReturnType>;
  }): {
    schema: Schema;
    resolve: (options: { context: SchemaContext; query: QueryArgs }) => ReturnType | Promise<ReturnType>;
  };
};

type QuerySingleMetadataBuilder<
  SchemaContext extends Record<string, any>,
  QueryArgs extends Record<string, any>,
  Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs>,
> = (helpers: {
  queryMetadata: QueryMetadataFn<SchemaContext, QueryArgs>;
}) => Metadata & EnforceQuerySingleMetadata<SchemaContext, QueryArgs, Metadata>;

type QueryManyMetadataBuilder<
  SchemaContext extends Record<string, any>,
  QueryArgs extends Record<string, any>,
  Metadata extends QueryManyMetadataMap<SchemaContext, QueryArgs>,
> = (helpers: {
  queryMetadata: QueryMetadataFn<SchemaContext, QueryArgs>;
}) => Metadata & EnforceQueryManyMetadata<SchemaContext, QueryArgs, Metadata>;

type QuerySingleFn<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  // non-nullable, with metadata builder
  <QueryArgs extends Record<string, any>, const Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs>>(options: {
    query?: z.ZodSchema<QueryArgs>;
    nullable?: false;
    allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
    metadata: QuerySingleMetadataBuilder<SchemaContext, QueryArgs, Metadata>;
    resolve: ({ context, query }: { context: SchemaContext; query: QueryArgs }) => Promise<ExtractEntityShape<SchemaEntities, ModelName>>;
  }): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, false, Metadata>;

  // non-nullable, with metadata object
  <QueryArgs extends Record<string, any>, const Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs>>(options: {
    query?: z.ZodSchema<QueryArgs>;
    nullable?: false;
    allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
    metadata: Metadata & EnforceQuerySingleMetadata<SchemaContext, QueryArgs, Metadata>;
    resolve: ({ context, query }: { context: SchemaContext; query: QueryArgs }) => Promise<ExtractEntityShape<SchemaEntities, ModelName>>;
  }): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, false, Metadata>;

  // non-nullable, no metadata
  <QueryArgs extends Record<string, any>>(
    options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, false, undefined>,
  ): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, false, undefined>;

  // nullable, with metadata builder
  <QueryArgs extends Record<string, any>, const Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs>>(options: {
    query?: z.ZodSchema<QueryArgs>;
    nullable: true;
    allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
    metadata: QuerySingleMetadataBuilder<SchemaContext, QueryArgs, Metadata>;
    resolve: ({
      context,
      query,
    }: {
      context: SchemaContext;
      query: QueryArgs;
    }) => Promise<ExtractEntityShape<SchemaEntities, ModelName> | null>;
  }): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, true, Metadata>;

  // nullable, with metadata object
  <QueryArgs extends Record<string, any>, const Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs>>(options: {
    query?: z.ZodSchema<QueryArgs>;
    nullable: true;
    allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
    metadata: Metadata & EnforceQuerySingleMetadata<SchemaContext, QueryArgs, Metadata>;
    resolve: ({
      context,
      query,
    }: {
      context: SchemaContext;
      query: QueryArgs;
    }) => Promise<ExtractEntityShape<SchemaEntities, ModelName> | null>;
  }): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, true, Metadata>;

  // nullable, no metadata
  <QueryArgs extends Record<string, any>>(
    options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, true, undefined> & { nullable: true },
  ): QuerySingle<SchemaContext, SchemaEntities, ModelName, QueryArgs, true, undefined>;
};

type QueryManyFn<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  // with metadata builder
  <QueryArgs extends Record<string, any>, const Metadata extends QueryManyMetadataMap<SchemaContext, QueryArgs>>(options: {
    query?: z.ZodSchema<QueryArgs>;
    allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
    metadata: QueryManyMetadataBuilder<SchemaContext, QueryArgs, Metadata>;
    resolve: ({
      context,
      query,
    }: {
      context: SchemaContext;
      query: QueryArgs;
    }) => Promise<Array<ExtractEntityShape<SchemaEntities, ModelName>>>;
  }): QueryMany<SchemaContext, SchemaEntities, ModelName, QueryArgs, Metadata>;

  // with metadata object
  <QueryArgs extends Record<string, any>, const Metadata extends QueryManyMetadataMap<SchemaContext, QueryArgs>>(options: {
    query?: z.ZodSchema<QueryArgs>;
    allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
    metadata: Metadata & EnforceQueryManyMetadata<SchemaContext, QueryArgs, Metadata>;
    resolve: ({
      context,
      query,
    }: {
      context: SchemaContext;
      query: QueryArgs;
    }) => Promise<Array<ExtractEntityShape<SchemaEntities, ModelName>>>;
  }): QueryMany<SchemaContext, SchemaEntities, ModelName, QueryArgs, Metadata>;

  // no metadata
  <QueryArgs extends Record<string, any>>(
    options: QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, undefined>,
  ): QueryMany<SchemaContext, SchemaEntities, ModelName, QueryArgs, undefined>;
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

export type QueryHelpers<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  querySingle: QuerySingleFn<SchemaContext, SchemaEntities, ModelName>;

  queryMany: QueryManyFn<SchemaContext, SchemaEntities, ModelName>;

  queryMetadata: QueryMetadataFn<SchemaContext>;
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

export type ModelConstructor<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  ModelSchema extends z.ZodObject<{
    [K in keyof ExtractEntityShape<SchemaEntities, ModelName>]: z.ZodType<ExtractEntityShape<SchemaEntities, ModelName>[K]>;
  }>,
  ModelFields extends Record<keyof ExtractEntityShape<SchemaEntities, ModelName>, Field<SchemaContext, SchemaEntities, ModelName>>,
  ModelQueries extends Record<string, any>,
  ModelIncludes extends IncludesMap<SchemaContext, SchemaEntities, ModelName>,
> = {
  schema: ModelSchema;
  allowEach?: (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean;
  fields: ({
    field,
  }: {
    field: (options?: FieldConstructor<SchemaContext, SchemaEntities, ModelName>) => Field<SchemaContext, SchemaEntities, ModelName>;
  }) => ModelFields;
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
  ModelFields extends Record<keyof ExtractEntityShape<SchemaEntities, ModelName>, Field<SchemaContext, SchemaEntities, ModelName>>,
  ModelQueries extends Record<string, any>,
  ModelIncludes extends IncludesMap<SchemaContext, SchemaEntities, ModelName> = {},
> {
  modelName: ModelName;

  schema: ModelSchema;

  allowEach?: (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean;

  fields: ({
    field,
  }: {
    field: (options?: FieldConstructor<SchemaContext, SchemaEntities, ModelName>) => Field<SchemaContext, SchemaEntities, ModelName>;
  }) => ModelFields;

  queries?: ModelQueries;

  includes?: ModelIncludes;

  constructor(
    modelName: ModelName,
    options: ModelConstructor<SchemaContext, SchemaEntities, ModelName, ModelSchema, ModelFields, ModelQueries, ModelIncludes>,
  ) {
    this.modelName = modelName;

    this.schema = options.schema;

    this.allowEach = options.allowEach;

    this.fields = options.fields;

    const querySingle = ((options: any) => {
      const metadata =
        typeof options.metadata === 'function'
          ? options.metadata({ queryMetadata: ((def: any) => this.queryMetadata(def)) as any })
          : options.metadata;

      return new QuerySingle(modelName as any, {
        ...options,
        metadata,
      });
    }) as QuerySingleFn<SchemaContext, SchemaEntities, ModelName>;

    const queryMany = ((options: any) => {
      const metadata =
        typeof options.metadata === 'function'
          ? options.metadata({ queryMetadata: ((def: any) => this.queryMetadata(def)) as any })
          : options.metadata;

      return new QueryMany(modelName as any, {
        ...options,
        metadata,
      });
    }) as QueryManyFn<SchemaContext, SchemaEntities, ModelName>;

    const queryMetadataHelper = ((def: any) => this.queryMetadata(def)) as QueryMetadataFn<SchemaContext>;

    const includeSingle = ((relationName: any, options: any) => new IncludeSingle(modelName, relationName, options)) as IncludeSingleFn<
      SchemaContext,
      SchemaEntities,
      ModelName
    >;

    const includeMany = ((relationName: any, options: any) => new IncludeMany(modelName, relationName, options)) as IncludeManyFn<
      SchemaContext,
      SchemaEntities,
      ModelName
    >;

    this.queries = options?.queries?.({
      querySingle,
      queryMany,
      queryMetadata: queryMetadataHelper,
    });

    this.includes = options?.includes?.({ includeSingle, includeMany });
  }

  public getSchema(): z.ZodObject {
    return this.schema;
  }

  public getAllowEach(): (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean {
    return this.allowEach || (() => true);
  }

  queryMetadata<ReturnType, Schema extends z.ZodType<ReturnType>>(def: {
    schema: Schema;
    resolve: (options: { context: SchemaContext; query: any }) => ReturnType | Promise<ReturnType>;
  }): {
    schema: Schema;
    resolve: (options: { context: SchemaContext; query: any }) => ReturnType | Promise<ReturnType>;
  } {
    return def;
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
  querySingle: QuerySingle<SchemaContext, SchemaEntities, ModelName, any, any, any>;
};

export type GetQueryManys<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  queryName: string;
  queryMany: QueryMany<SchemaContext, SchemaEntities, ModelName, any, any>;
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
