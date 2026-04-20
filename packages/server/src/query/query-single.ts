import { z } from 'zod';

import { ExtractEntityShape } from '../extract-entity-shape.js';

export type QuerySingleMetadataDef<SchemaContext extends Record<string, any>, Query, ReturnType, Schema extends z.ZodTypeAny> = {
  schema: Schema;
  resolve: (options: { context: SchemaContext; query: Query }) => ReturnType | Promise<ReturnType>;
};

export type QuerySingleMetadataMap<SchemaContext extends Record<string, any>, QueryArgs extends Record<string, any>> = Record<
  string,
  QuerySingleMetadataDef<SchemaContext, QueryArgs, any, z.ZodTypeAny>
>;

export type EnforceQuerySingleMetadata<
  SchemaContext extends Record<string, any>,
  QueryArgs extends Record<string, any>,
  Meta extends QuerySingleMetadataMap<SchemaContext, QueryArgs>,
> = {
  [K in keyof Meta]: Meta[K] extends {
    schema: infer S extends z.ZodTypeAny;
    resolve: (...args: any[]) => infer R;
  }
    ? QuerySingleMetadataDef<SchemaContext, QueryArgs, Awaited<R>, S> & Meta[K]
    : never;
};

export type QuerySingleOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
  Nullable extends boolean = false,
  Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs> | undefined = undefined,
> = {
  query?: z.ZodSchema<QueryArgs>;
  nullable?: Nullable;
  allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
  metadata?: Metadata;
  resolve: ({
    context,
    query,
  }: {
    context: SchemaContext;
    query: QueryArgs;
  }) => Nullable extends true
    ? Promise<ExtractEntityShape<SchemaEntities, ModelName> | null>
    : Promise<ExtractEntityShape<SchemaEntities, ModelName>>;
};

export class QuerySingle<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
  Nullable extends boolean = false,
  Metadata extends QuerySingleMetadataMap<SchemaContext, QueryArgs> | undefined = undefined,
> {
  readonly modelName: ModelName;

  readonly options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Nullable, Metadata>;

  constructor(modelName: ModelName, options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Nullable, Metadata>) {
    this.modelName = modelName;
    this.options = options;
  }

  public getModelName(): ModelName {
    return this.modelName;
  }

  public getOptions(): QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Nullable, Metadata> {
    return this.options;
  }

  public isNullable(): boolean {
    return this.options.nullable ?? false;
  }

  public getMetadataOptions(): Metadata | undefined {
    return this.options.metadata;
  }

  public getAllow(): (options: { context: SchemaContext; query: z.infer<QueryArgs> }) => Promise<boolean> | boolean {
    return this.options.allow ?? (async () => true);
  }
}
