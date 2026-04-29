/**
 * Client-side aggregate contract.
 *
 * The client is parameterized by a single `ClientSchema` (emitted by codegen
 * in `@tql/server`). Every shape the client needs — query inputs, query
 * responses, mutation inputs, mutation responses, entity shapes, and the
 * per-query / per-mutation registries that drive response projection — is
 * read by indexing into one of its seven maps. Consumers never need to drag
 * the server resolver classes into the client's type graph.
 *
 * Per-call response data is projected from the *user's actual* `select` /
 * `include` shape (passed in `QueryInput`), not from the static
 * `QueryResponseMap` default. That keeps `draft` types in update hooks in
 * sync with what the query actually fetches.
 *
 * All projection helpers (`Selected`, `IncludeProjection`, `Remove__Model`,
 * `QueryDataFor`, …) are imported from `@tql/server/shared` so the client
 * and the codegen output share a single source of truth.
 */
import type { ClientSchema, QueryDataFor, Remove__Model } from '@tql/server/shared';
import type { TransportKey } from '../transports';

export type { ClientSchema, QueryDataFor };

export type { IncludeKind, MutationOp, QueryRegistryEntry } from '@tql/server/shared';

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type QueryModelFor<S extends ClientSchema> = keyof S['QueryInputMap'] & string;

export type QueryNameFor<S extends ClientSchema> = keyof S['QueryInputMap'] & string;

export type QueryInputFor<S extends ClientSchema, QueryName extends QueryNameFor<S>> = NonNullable<S['QueryInputMap'][QueryName]>;

export type SingleQueryRequestFor<
  S extends ClientSchema,
  QueryName extends QueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName> = QueryInputFor<S, QueryName>,
> = {
  [K in QueryName]: QueryInput;
};

/**
 * Per-call query response: a projection of `QueryResponseMap` to just the
 * keys present in the request shape.
 */
export type QueryResponse<S extends ClientSchema, QueryInput extends Record<string, any>> = {
  [K in keyof QueryInput & keyof S['QueryResponseMap']]: S['QueryResponseMap'][K];
};

export type QueryOptions<
  S extends ClientSchema,
  QueryName extends QueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> = {
  queryKey: string;
  query: (params: QueryParams) => QueryInput;
  staleTimeInMs?: number;
  isEnabled?: boolean;
  /**
   * Which registered transport should serve this query. Defaults to the
   * client's `defaultTransport` (or `'http'`).
   */
  transport?: TransportKey;
};

export type QueryModelNameFor<S extends ClientSchema> = keyof S['SchemaEntities'] & string;

export type QueryModelShapeFor<S extends ClientSchema, ModelName extends QueryModelNameFor<S>> = Remove__Model<
  S['SchemaEntities'][ModelName]
>;

export type QueryModelUpdateHook<
  S extends ClientSchema,
  ModelName extends QueryModelNameFor<S>,
  QueryName extends QueryNameFor<S>,
  QueryModel extends QueryModelShapeFor<S, ModelName>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> = {
  filter?: (params: { params: QueryParams; change: QueryModel }) => boolean;
  onInsert?: (params: {
    draft: QueryDataFor<S, QueryName, QueryInput>;
    change: QueryModel;
    params: QueryParams;
  }) => QueryDataFor<S, QueryName, QueryInput> | void;
  onUpdate?: (params: {
    draft: QueryDataFor<S, QueryName, QueryInput>;
    change: QueryModel;
    params: QueryParams;
  }) => QueryDataFor<S, QueryName, QueryInput> | void;
  onUpsert?: (params: {
    draft: QueryDataFor<S, QueryName, QueryInput>;
    change: QueryModel;
    params: QueryParams;
  }) => QueryDataFor<S, QueryName, QueryInput> | void;
  onDelete?: (params: {
    draft: QueryDataFor<S, QueryName, QueryInput>;
    change: QueryModel;
    params: QueryParams;
  }) => QueryDataFor<S, QueryName, QueryInput> | void;
};

// modelName -> queryName -> QueryUpdateHooks
export type QueryUpdateHooksMap = Record<string, Record<string, QueryUpdateHooks>>;

export type QueryUpdateHooks = {
  modelName: QueryModelNameFor<any>;
  hooks: QueryModelUpdateHook<any, any, any, any, any, any>;
  queryName: QueryNameFor<any>;
};
