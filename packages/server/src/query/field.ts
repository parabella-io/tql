import { ExtractEntityShape } from '../extract-entity-shape.js';

export class Field<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> {
  allow?: (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean;
}

export type FieldConstructor<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = {
  allow?: (options: { context: SchemaContext; entity: ExtractEntityShape<SchemaEntities, ModelName> }) => boolean;
};
