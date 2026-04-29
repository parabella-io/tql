import type { FormattedTQLServerError } from '../errors.js';

import type {
  ExtractInclude,
  ExtractSelect,
  IncludeKind,
  IncludeProjection,
  Remove__Model,
  Selected,
  SelectedExternal,
} from './projection.js';

/**
 * Shape of a single entry in the codegen-emitted `QueryRegistry`. Carries
 * everything required to project a response from a user-supplied input:
 *
 *  - `entity`     — the underlying entity shape (with its `__model` brand).
 *  - `kind`       — single / many arity.
 *  - `nullable`   — whether a `single` query may resolve to `null`.
 *  - `includeMap` — the parent's per-relation include map, or `never` when
 *                   the model has no relations.
 *  - `externalFieldKeys` — batch-resolved scalar keys (not on `entity` Zod).
 *  - `externalFields` — value types for those keys (from each field's own Zod schema).
 */
export type QueryRegistryEntry = {
  entity: object;
  kind: IncludeKind;
  nullable: boolean;
  includeMap: unknown;
  /** Keys resolved by batch `externalField` resolvers when selected (not DB columns). */
  externalFieldKeys?: readonly string[];
  /** Per-key output types for external-only selects (not part of `entity`). */
  externalFields: Record<string, unknown>;
};

/**
 * Project per-call data for a single query directly from a {@link
 * QueryRegistryEntry}-shaped registry and a user-supplied input.
 *
 * Schema-agnostic and *retains* the `__model` brand — used by the
 * codegen-emitted `QueryResponseMap` so resolver classes (and any
 * server-side runtime test harness) can still observe the brand.
 */
type ExternalFieldValuesOf<Registry extends Record<string, any>, QueryName extends keyof Registry> = Registry[
  QueryName
] extends { externalFields: infer Ext }
  ? Ext
  : Record<never, never>;

export type QueryDataFromRegistry<
  Registry extends Record<string, any>,
  QueryName extends keyof Registry,
  QueryInput,
> = (
  Selected<Registry[QueryName]['entity'], ExtractSelect<QueryInput>> &
    SelectedExternal<ExternalFieldValuesOf<Registry, QueryName>, ExtractSelect<QueryInput>> &
    IncludeProjection<ExtractInclude<QueryInput>, Registry[QueryName]['includeMap']>
) extends infer Projection
  ? Registry[QueryName]['kind'] extends 'many'
    ? Projection[]
    : Registry[QueryName]['nullable'] extends true
      ? Projection | null
      : Projection
  : never;

/**
 * Client-facing convenience wrapper around {@link QueryDataFromRegistry}
 * that *strips* the `__model` brand recursively. Used by `@tql/client` to
 * derive per-call response data without exposing the codegen-only marker
 * to consumers.
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
  };
};
