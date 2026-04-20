import { z } from 'zod';

import { ExtractEntityShape } from '../extract-entity-shape.js';

export type QueryManyMetadataDef<SchemaContext extends Record<string, any>, Query, ReturnType, Schema extends z.ZodTypeAny> = {
  schema: Schema;
  resolve: (options: { context: SchemaContext; query: Query }) => ReturnType | Promise<ReturnType>;
};

export type QueryManyMetadataMap<SchemaContext extends Record<string, any>, QueryArgs extends Record<string, any>> = Record<
  string,
  QueryManyMetadataDef<SchemaContext, QueryArgs, any, z.ZodTypeAny>
>;

export type EnforceQueryManyMetadata<
  SchemaContext extends Record<string, any>,
  QueryArgs extends Record<string, any>,
  Meta extends QueryManyMetadataMap<SchemaContext, QueryArgs>,
> = {
  [K in keyof Meta]: Meta[K] extends {
    schema: infer S extends z.ZodTypeAny;
    resolve: (...args: any[]) => infer R;
  }
    ? QueryManyMetadataDef<SchemaContext, QueryArgs, Awaited<R>, S> & Meta[K]
    : never;
};

export type QueryManyOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
  Metadata extends QueryManyMetadataMap<SchemaContext, QueryArgs> | undefined = undefined,
> = {
  query?: z.ZodSchema<QueryArgs>;
  allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
  metadata?: Metadata;
  resolve: ({
    context,
    query,
  }: {
    context: SchemaContext;
    query: QueryArgs;
  }) => Promise<Array<ExtractEntityShape<SchemaEntities, ModelName>>>;
};

export class QueryMany<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
  Metadata extends QueryManyMetadataMap<SchemaContext, QueryArgs> | undefined = undefined,
> {
  readonly modelName: ModelName;
  readonly options: QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Metadata>;

  constructor(modelName: ModelName, options: QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Metadata>) {
    this.modelName = modelName;
    this.options = options;
  }

  public getModelName(): ModelName {
    return this.modelName;
  }

  public getOptions(): QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Metadata> {
    return this.options;
  }

  public getMetadataOptions(): Metadata | undefined {
    return this.options.metadata;
  }

  public getAllow(): (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean {
    return this.options.allow ?? (async () => true);
  }
}
