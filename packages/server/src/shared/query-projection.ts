import type { FormattedTQLServerError } from '../errors.js';

import type { ClientSchema } from './client-schema.js';
import type { ExtractInclude, ExtractSelect, IncludeKind, IncludeProjection, Selected } from './projection.js';

/**
 * Shape of a single entry in the codegen-emitted `QueryRegistry`. Carries
 * everything required to project a response from a user-supplied input:
 *
 *  - `entity`     — the underlying entity shape.
 *  - `kind`       — single / many arity.
 *  - `nullable`   — whether a `single` query may resolve to `null`.
 *  - `includeMap` — the parent's per-relation include map, or `never` when
 *                   the model has no relations.
 */
export type QueryRegistryEntry = {
  entity: object;
  kind: IncludeKind;
  nullable: boolean;
  includeMap: unknown;
};

/**
 * Project per-call data for a single query directly from a {@link
 * QueryRegistryEntry}-shaped registry and a user-supplied input.
 */
export type QueryDataFromRegistry<Registry, QueryName extends keyof Registry, QueryInput> = Registry[QueryName] extends infer R
  ? R extends QueryRegistryEntry
    ? Selected<R['entity'], ExtractSelect<QueryInput>> &
        IncludeProjection<ExtractInclude<QueryInput>, R['includeMap']> extends infer Projection
      ? R['kind'] extends 'many'
        ? Projection[]
        : R['nullable'] extends true
          ? Projection | null
          : Projection
      : never
    : never
  : never;

/**
 * Client-facing alias for {@link QueryDataFromRegistry} parameterized by the
 * aggregate {@link ClientSchema}. Used by `@tql/client` to derive per-call
 * response data.
 */
export type QueryDataFor<S extends ClientSchema, QueryName extends keyof S['QueryRegistry'], QueryInput> = QueryDataFromRegistry<
  S['QueryRegistry'],
  QueryName,
  QueryInput
>;

/**
 * Per-call response shape returned by `Server.handleQuery` and the
 * codegen-emitted `handleQuery` stub. Each requested key carries the
 * projected `data`, an optional `error`, and a metadata bag.
 *
 * Parameterized on `Registry` + `InputMap` directly so codegen can emit
 * `HandleQueryResponseFor<QueryRegistry, QueryInputMap, Q>` without
 * circling back through `ClientSchema`.
 */
export type HandleQueryResponseFor<Registry, InputMap, Q extends Partial<InputMap>> = {
  [K in keyof Q & keyof Registry & keyof InputMap]: {
    data: (Q[K] extends InputMap[K] ? QueryDataFromRegistry<Registry, K, Q[K]> : never) | null;
    error: FormattedTQLServerError | null;
    metadata: Record<string, unknown>;
  };
};

/**
 * Fixed per-query response map. Each key resolves to the *full* entity
 * shape (no select projection) so resolver classes can reference it
 * without paying the cost of per-call inference.
 */
export type QueryResponseMapFor<Registry, InputMap> = {
  [K in keyof InputMap & keyof Registry]: {
    data: QueryDataFromRegistry<Registry, K, InputMap[K]> | null;
    error: FormattedTQLServerError | null;
    metadata: Record<string, unknown>;
  };
};
