import { z } from 'zod';
import { ExtractEntityShape } from '../extract-entity-shape.js';

type RelationEntity<SchemaEntities extends Record<string, any>, RelationName extends keyof SchemaEntities & string> = ExtractEntityShape<
  SchemaEntities,
  RelationName
>;

type ResolvedIncludeEntity<
  SchemaEntities extends Record<string, any>,
  RelationName extends keyof SchemaEntities & string,
  MatchKey extends string,
> = RelationEntity<SchemaEntities, RelationName> & Record<MatchKey, string>;

export type IncludeSingleOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  RelationName extends keyof SchemaEntities & string,
  QueryArgs extends Record<string, any>,
  Nullable extends boolean,
  MatchKey extends string = keyof RelationEntity<SchemaEntities, RelationName> & string,
> = {
  query?: z.ZodSchema<QueryArgs>;
  nullable?: Nullable;
  matchKey: MatchKey;
  allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
  resolve: ({
    context,
    query,
  }: {
    context: SchemaContext;
    query: QueryArgs;
    parents: Array<ExtractEntityShape<SchemaEntities, ModelName>>;
  }) => Promise<Array<ResolvedIncludeEntity<SchemaEntities, RelationName, MatchKey>>>;
};

export class IncludeSingle<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  RelationName extends keyof SchemaEntities & string,
  QueryArgs extends Record<string, any>,
  Nullable extends boolean = false,
  MatchKey extends string = keyof RelationEntity<SchemaEntities, RelationName> & string,
> {
  readonly modelName: ModelName;

  readonly relationName: RelationName;

  readonly options: IncludeSingleOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, Nullable, MatchKey>;

  constructor(
    modelName: ModelName,
    relationName: RelationName,
    options: IncludeSingleOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, Nullable, MatchKey>,
  ) {
    this.modelName = modelName;
    this.relationName = relationName;
    this.options = options;
  }

  public getModelName(): ModelName {
    return this.modelName;
  }

  public getRelationName(): RelationName {
    return this.relationName;
  }

  public getOptions(): IncludeSingleOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, Nullable, MatchKey> {
    return this.options;
  }

  public getMatchKey(): MatchKey {
    return this.options.matchKey;
  }

  public isNullable(): boolean {
    return this.options.nullable ?? false;
  }
}
