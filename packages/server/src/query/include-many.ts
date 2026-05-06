import { z } from 'zod';

import { ExtractEntityShape } from '../extract-entity-shape.js';
import type { IncludeManyOptionsExtensions, SchemaContextExtensions } from '../plugins/extensions.js';

type RelationEntity<SchemaEntities extends Record<string, any>, RelationName extends keyof SchemaEntities & string> = ExtractEntityShape<
  SchemaEntities,
  RelationName
>;

type ResolvedIncludeEntity<
  SchemaEntities extends Record<string, any>,
  RelationName extends keyof SchemaEntities & string,
  MatchKey extends string,
> = RelationEntity<SchemaEntities, RelationName> & Record<MatchKey, string>;

export type IncludeManyOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  RelationName extends keyof SchemaEntities & string,
  QueryArgs extends Record<string, any>,
  MatchKey extends string = keyof RelationEntity<SchemaEntities, RelationName> & string,
> = {
  query?: z.ZodSchema<QueryArgs>;
  matchKey: MatchKey;
  allow?: (options: { context: SchemaContext & SchemaContextExtensions; query: QueryArgs }) => Promise<boolean> | boolean;
  resolve: ({
    context,
    query,
    signal,
  }: {
    context: SchemaContext & SchemaContextExtensions;
    query: QueryArgs;
    parents: Array<ExtractEntityShape<SchemaEntities, ModelName>>;
    signal?: AbortSignal;
  }) => Promise<Array<ResolvedIncludeEntity<SchemaEntities, RelationName, MatchKey>>>;
} & IncludeManyOptionsExtensions<QueryArgs>;

export class IncludeMany<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  RelationName extends keyof SchemaEntities & string,
  QueryArgs extends Record<string, any>,
  MatchKey extends string = keyof RelationEntity<SchemaEntities, RelationName> & string,
> {
  readonly modelName: ModelName;

  readonly relationName: RelationName;

  readonly options: IncludeManyOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, MatchKey>;

  constructor(
    modelName: ModelName,
    relationName: RelationName,
    options: IncludeManyOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, MatchKey>,
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

  public getOptions(): IncludeManyOptions<SchemaContext, SchemaEntities, ModelName, RelationName, QueryArgs, MatchKey> {
    return this.options;
  }

  public getMatchKey(): MatchKey {
    return this.options.matchKey;
  }

  public getExtensions(): IncludeManyOptionsExtensions<QueryArgs> {
    return this.options;
  }
}
