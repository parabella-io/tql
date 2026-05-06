import type { z } from 'zod';

import type { ExtractEntityShape } from '../extract-entity-shape.js';
import type { ExternalFieldOptionsExtensions } from '../plugins/extensions.js';

export type ExternalFieldResolveArgs<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  context: SchemaContext;
  entities: Array<ExtractEntityShape<SchemaEntities, ModelName>>;
};

export class ExternalField<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  Value,
> {
  readonly resolve: (args: ExternalFieldResolveArgs<SchemaContext, SchemaEntities, ModelName>) => Value[] | Promise<Value[]>;

  readonly schema: z.ZodType<Value, any, any>;

  private readonly options: {
    resolve: ExternalField<SchemaContext, SchemaEntities, ModelName, Value>['resolve'];
    schema: z.ZodType<Value, any, any>;
  } & ExternalFieldOptionsExtensions<SchemaContext, ExtractEntityShape<SchemaEntities, ModelName>, Value>;

  constructor(
    options: {
      resolve: ExternalField<SchemaContext, SchemaEntities, ModelName, Value>['resolve'];
      schema: z.ZodType<Value, any, any>;
    } & ExternalFieldOptionsExtensions<SchemaContext, ExtractEntityShape<SchemaEntities, ModelName>, Value>,
  ) {
    this.options = options;
    this.resolve = options.resolve;
    this.schema = options.schema;
  }

  public getOptions(): {
    resolve: ExternalField<SchemaContext, SchemaEntities, ModelName, Value>['resolve'];
    schema: z.ZodType<Value, any, any>;
  } & ExternalFieldOptionsExtensions<SchemaContext, ExtractEntityShape<SchemaEntities, ModelName>, Value> {
    return this.options;
  }

  public getExtensions(): ExternalFieldOptionsExtensions<SchemaContext, ExtractEntityShape<SchemaEntities, ModelName>, Value> {
    return this.options;
  }
}

export function externalField<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  Value,
>(options: {
  resolve: (args: ExternalFieldResolveArgs<SchemaContext, SchemaEntities, ModelName>) => Value[] | Promise<Value[]>;
  schema: z.ZodType<Value, any, any>;
} & ExternalFieldOptionsExtensions<SchemaContext, ExtractEntityShape<SchemaEntities, ModelName>, Value>): ExternalField<
  SchemaContext,
  SchemaEntities,
  ModelName,
  Value
> {
  return new ExternalField<SchemaContext, SchemaEntities, ModelName, Value>(options);
}
