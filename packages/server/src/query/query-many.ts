import { z } from 'zod';

import { ExtractEntityShape } from '../extract-entity-shape.js';

export type WithPagingConfig = {
  maxTakeSize?: number;
  defaultTakeSize?: number;
  minTakeSize?: number;
};

/** Resolved paging arguments passed to a paginated `queryMany` resolver after input validation. */
export type PagingInputArgs = {
  take: number;
  before: string | null;
  after: string | null;
};

/** Resolver-returned paging metadata; validated before leaving the server. */
export type ResolvedPagingInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

type EntityRow<SchemaEntities extends Record<string, any>, ModelName extends keyof SchemaEntities> = Array<
  ExtractEntityShape<SchemaEntities, ModelName>
>;

export type QueryManyOptionsNonPaginated<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
> = {
  query?: z.ZodSchema<QueryArgs>;
  allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
  resolve: (args: { context: SchemaContext; query: QueryArgs }) => Promise<EntityRow<SchemaEntities, ModelName>>;
};

export type QueryManyOptionsPaginated<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
> = {
  query?: z.ZodSchema<QueryArgs>;
  withPaging: WithPagingConfig;
  allow?: (options: { context: SchemaContext; query: QueryArgs }) => Promise<boolean> | boolean;
  resolve: (args: {
    context: SchemaContext;
    query: QueryArgs;
    pagingInfo: PagingInputArgs;
  }) => Promise<{ entities: EntityRow<SchemaEntities, ModelName>; pagingInfo: ResolvedPagingInfo }>;
};

export type QueryManyOptions<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
> =
  | QueryManyOptionsNonPaginated<SchemaContext, SchemaEntities, ModelName, QueryArgs>
  | QueryManyOptionsPaginated<SchemaContext, SchemaEntities, ModelName, QueryArgs>;

export class QueryMany<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, any>,
  ModelName extends keyof SchemaEntities,
  QueryArgs extends Record<string, any>,
> {
  readonly modelName: ModelName;

  readonly options: QueryManyOptions<SchemaContext, SchemaEntities, ModelName, QueryArgs>;

  private pagingInputSchemaCache: z.ZodTypeAny | null = null;

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

  public isPaginated(): boolean {
    return 'withPaging' in this.options && (this.options as QueryManyOptionsPaginated<any, any, any, any>).withPaging !== undefined;
  }

  public getWithPaging(): WithPagingConfig | undefined {
    if (!this.isPaginated()) return undefined;
    return (this.options as QueryManyOptionsPaginated<SchemaContext, SchemaEntities, ModelName, QueryArgs>).withPaging;
  }

  /**
   * Framework-owned input schema for `pagingInfo`: take (+ optional default), optional before/after cursors.
   * Omitted cursor keys are treated as `null`. At most one of `before` / `after` may be non-null.
   * Only valid when {@link isPaginated} is true.
   */
  public getPagingInputSchema(): z.ZodType<PagingInputArgs> {
    if (!this.isPaginated()) {
      throw new Error('QueryMany.getPagingInputSchema called on non-paginated query');
    }

    if (this.pagingInputSchemaCache) {
      return this.pagingInputSchemaCache as z.ZodType<PagingInputArgs>;
    }

    const wp = (this.options as QueryManyOptionsPaginated<SchemaContext, SchemaEntities, ModelName, QueryArgs>).withPaging;

    const baseTake = z.number().int().positive();

    const take = wp.defaultTakeSize !== undefined ? baseTake.default(wp.defaultTakeSize) : baseTake;

    const schema = z
      .object({
        take,
        before: z.string().nullable().optional(),
        after: z.string().nullable().optional(),
      })
      .superRefine((val, ctx) => {
        const hasBefore = val.before !== undefined && val.before !== null;
        const hasAfter = val.after !== undefined && val.after !== null;
        if (hasBefore && hasAfter) {
          ctx.addIssue({
            code: 'custom',
            message: 'Only one of before or after may be set.',
            path: ['after'],
          });
        }
      })
      .transform(
        (val): PagingInputArgs => ({
          take: val.take,
          before: val.before ?? null,
          after: val.after ?? null,
        }),
      );

    this.pagingInputSchemaCache = schema;
    return schema;
  }
}
