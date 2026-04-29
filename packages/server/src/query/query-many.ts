import { z } from 'zod';

import { ExtractEntityShape } from '../extract-entity-shape.js';

export type QueryManyOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
> = {
  query?: z.ZodSchema<QueryArgs>;
  allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
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
> {
  readonly modelName: ModelName;
  readonly options: QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs>;

  constructor(modelName: ModelName, options: QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs>) {
    this.modelName = modelName;
    this.options = options;
  }

  public getModelName(): ModelName {
    return this.modelName;
  }

  public getOptions(): QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs> {
    return this.options;
  }

  public getAllow(): (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean {
    return this.options.allow ?? (async () => true);
  }
}
