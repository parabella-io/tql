import { z } from 'zod';

import { ExtractEntityShape } from '../extract-entity-shape.js';
import type { QuerySingleOptionsExtensions, SchemaContextExtensions } from '../plugins/extensions.js';

export type QuerySingleOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
  Nullable extends boolean = false,
> = {
  query?: z.ZodSchema<QueryArgs>;
  nullable?: Nullable;
  allow?: (options: { context: SchemaContext & SchemaContextExtensions; query: QueryArgs }) => Promise<boolean> | boolean;
  resolve: ({
    context,
    query,
    signal,
  }: {
    context: SchemaContext & SchemaContextExtensions;
    query: QueryArgs;
    signal?: AbortSignal;
  }) => Nullable extends true
    ? Promise<ExtractEntityShape<SchemaEntities, ModelName> | null>
    : Promise<ExtractEntityShape<SchemaEntities, ModelName>>;
} & QuerySingleOptionsExtensions<QueryArgs>;

export class QuerySingle<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
  Nullable extends boolean = false,
> {
  readonly modelName: ModelName;

  readonly options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Nullable>;

  constructor(modelName: ModelName, options: QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Nullable>) {
    this.modelName = modelName;
    this.options = options;
  }

  public getModelName(): ModelName {
    return this.modelName;
  }

  public getOptions(): QuerySingleOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs, Nullable> {
    return this.options;
  }

  public isNullable(): boolean {
    return this.options.nullable ?? false;
  }

  public getAllow(): (options: {
    context: SchemaContext & SchemaContextExtensions;
    query: z.infer<QueryArgs>;
  }) => Promise<boolean> | boolean {
    return this.options.allow ?? (async () => true);
  }

  public getExtensions(): QuerySingleOptionsExtensions<QueryArgs> {
    return this.options;
  }
}
