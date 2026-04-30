import type { FormattedTQLServerError } from '../errors.js';

import type {
  ExtractInclude,
  ExtractSelect,
  IncludeKind,
  IncludeProjection,
  Remove__Model,
  Selected,
} from './projection.js';

/**
 * Shape of a single entry in the codegen-emitted `QueryRegistry`. Carries
 * everything required to project a response from a user-supplied input:
 *
 *  - `entity`     — the underlying entity shape.
 *  - `kind`       — single / many arity.
 *  - `nullable`   — whether a `single` query may resolve to `null`.
 *  - `includeMap` — the parent's per-relation include map, or `never` when
 *                   the model has no relations.
 *  - `paginated` — when `kind` is `'many'`, whether the public query response
 *                  includes response-level `pagingInfo` (cursor paging). `data`
 *                  is still the projected entity array.
 *  - `externalFieldKeys` — batch-resolved scalar keys included on the entity.
 */
export type ResolvedPagingInfoShape = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type QueryRegistryEntry = {
  entity: object;
  kind: IncludeKind;
  nullable: boolean;
  /** Present on `kind: 'many'` entries emitted by codegen. */
  paginated?: boolean;
  includeMap: unknown;
  /** Keys resolved by batch `externalField` resolvers when selected. */
  externalFieldKeys?: readonly string[];
};

/**
 * Project per-call data for a single query directly from a {@link
 * QueryRegistryEntry}-shaped registry and a user-supplied input.
 *
 * Schema-agnostic and used by the codegen-emitted `QueryResponseMap` so
 * resolver classes can reference named response shapes.
 */
export type QueryDataFromRegistry<
  Registry extends Record<string, any>,
  QueryName extends keyof Registry,
  QueryInput,
> = (
  Selected<Registry[QueryName]['entity'], ExtractSelect<QueryInput>> &
    IncludeProjection<ExtractInclude<QueryInput>, Registry[QueryName]['includeMap']>
) extends infer Projection
  ? Registry[QueryName]['kind'] extends 'many'
    ? Projection[]
    : Registry[QueryName]['nullable'] extends true
      ? Projection | null
      : Projection
  : never;

/** Response-level paging metadata for paginated `queryMany` entries; `null` for all other queries. */
export type QueryPagingInfoFromRegistry<
  Registry extends Record<string, any>,
  QueryName extends keyof Registry,
> = Registry[QueryName] extends { kind: 'many'; paginated: true }
  ? ResolvedPagingInfoShape | null
  : null;

/**
 * Client-facing convenience wrapper around {@link QueryDataFromRegistry}
 * that derives per-call response data for `@tql/client`.
 */
export type QueryDataFor<
  S extends { QueryRegistry: Record<string, any> },
  QueryName extends keyof S['QueryRegistry'],
  QueryInput,
> = Remove__Model<QueryDataFromRegistry<S['QueryRegistry'], QueryName, QueryInput>>;

/**
 * Per-call response shape returned by `Server.handleQuery` and the
 * codegen-emitted `handleQuery` stub. Each requested key carries the
 * projected `data` and an optional `error`.
 *
 * Parameterized on `Registry` + `InputMap` directly so codegen can emit
 * `HandleQueryResponseFor<QueryRegistry, QueryInputMap, Q>` without
 * circling back through `ClientSchema`.
 */
export type HandleQueryResponseFor<Registry extends Record<string, any>, InputMap, Q extends Partial<InputMap>> = {
  [K in keyof Q & keyof Registry & keyof InputMap]: {
    data: (Q[K] extends InputMap[K] ? QueryDataFromRegistry<Registry, K, Q[K]> : never) | null;
    error: FormattedTQLServerError | null;
    pagingInfo: QueryPagingInfoFromRegistry<Registry, K>;
  };
};

/**
 * Fixed per-query response map. Each key resolves to the *full* entity
 * shape (no select projection) so resolver classes can reference it
 * without paying the cost of per-call inference.
 */
export type QueryResponseMapFor<Registry extends Record<string, any>, InputMap> = {
  [K in keyof InputMap & keyof Registry]: {
    data: QueryDataFromRegistry<Registry, K, InputMap[K]> | null;
    error: FormattedTQLServerError | null;
    pagingInfo: QueryPagingInfoFromRegistry<Registry, K>;
  };
};
