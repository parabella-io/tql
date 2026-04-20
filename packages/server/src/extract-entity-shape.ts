export type ExtractEntityShape<
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
> = SchemaEntities[ModelName];
