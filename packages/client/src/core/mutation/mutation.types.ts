import type { ClientSchema, MutationChangesFor } from '@tql/server/shared';

import { OptimisticQueryStore } from '../query/query-optimistic-update';

export type OptimisticQueryStorePublic = Omit<OptimisticQueryStore, 'start' | 'commit' | 'rollback'>;

export type MutationNameFor<S extends ClientSchema> = keyof S['MutationInputMap'] & string;

export type MutationInputFor<S extends ClientSchema, MutationName extends MutationNameFor<S>> = NonNullable<
  S['MutationInputMap'][MutationName]
>;

export type MutationPayloadFor<S extends ClientSchema, MutationName extends MutationNameFor<S>> =
  MutationInputFor<S, MutationName> extends { input: infer Input } ? Input : never;

export type SingleMutationRequestFor<S extends ClientSchema, MutationName extends MutationNameFor<S>> = {
  [K in MutationName]: MutationInputFor<S, K>;
};

/**
 * Project the schema's response map to only the mutations referenced in the request.
 */
export type MutationResponse<S extends ClientSchema, MutationInput extends Record<string, any>> = {
  [K in keyof MutationInput & keyof S['MutationResponseMap']]: S['MutationResponseMap'][K];
};

export type SingleMutationResult<S extends ClientSchema, MutationInput extends Record<string, any>> = MutationResponse<
  S,
  MutationInput
>[keyof MutationResponse<S, MutationInput> & string];

// =============================================================================
// CHANGE-PROJECTION HELPERS
//
// Driven directly off the codegen-emitted `MutationRegistry` and
// `SchemaEntities` via the shared {@link MutationChangesFor} helper from
// `@tql/server/shared`. Bypasses `MutationResponseMap` so the payload
// helpers stay resilient if the response envelope ever grows new sibling
// fields.
// =============================================================================

/**
 * Per-mutation `changes` shape — the same `MutationChangesFor` exposed by
 * `@tql/server/shared`, narrowed to the registry slot for `MutationName`.
 */
export type SingleMutationChangesForName<
  S extends ClientSchema,
  MutationName extends MutationNameFor<S>,
> = MutationName extends keyof S['MutationRegistry'] ? MutationChangesFor<S, MutationName> : never;

export type SingleMutationChanges<S extends ClientSchema, MutationInput extends Record<string, any>> = SingleMutationChangesForName<
  S,
  Extract<keyof MutationInput, MutationNameFor<S>>
>;

/**
 * Generic `changes` helper used by per-row payload helpers below.
 */
export type MutationChanges<R> = R;

export type MutationModelKeys<R> = R extends Record<string, any> ? keyof R & string : never;

export type InsertEntity<R, K extends string> =
  R extends Record<string, any> ? (K extends keyof R ? (R[K] extends { inserts?: Array<infer E> } ? E : never) : never) : never;

export type UpdateEntity<R, K extends string> =
  R extends Record<string, any> ? (K extends keyof R ? (R[K] extends { updates?: Array<infer E> } ? E : never) : never) : never;

export type UpsertEntity<R, K extends string> =
  R extends Record<string, any> ? (K extends keyof R ? (R[K] extends { upserts?: Array<infer E> } ? E : never) : never) : never;

export type DeleteEntity = { id: string };

export type InsertPayload<R> = Partial<{ [K in MutationModelKeys<R>]: InsertEntity<R, K> }>;

export type UpdatePayload<R> = Partial<{ [K in MutationModelKeys<R>]: UpdateEntity<R, K> }>;

export type UpsertPayload<R> = Partial<{ [K in MutationModelKeys<R>]: UpsertEntity<R, K> }>;

export type DeletePayload<R> = Partial<Record<MutationModelKeys<R>, DeleteEntity>>;

export type InsertHookParams<Input, S extends ClientSchema, MutationName extends MutationNameFor<S>> = {
  store: OptimisticQueryStorePublic;
  input: Input;
  inserted: InsertPayload<SingleMutationChangesForName<S, MutationName>>;
};

export type UpdateHookParams<Input, S extends ClientSchema, MutationName extends MutationNameFor<S>> = {
  store: OptimisticQueryStorePublic;
  input: Input;
  updated: UpdatePayload<SingleMutationChangesForName<S, MutationName>>;
};

export type DeleteHookParams<Input, S extends ClientSchema, MutationName extends MutationNameFor<S>> = {
  store: OptimisticQueryStorePublic;
  input: Input;
  deleted: DeletePayload<SingleMutationChangesForName<S, MutationName>>;
};

export type UpsertHookParams<Input, S extends ClientSchema, MutationName extends MutationNameFor<S>> = {
  store: OptimisticQueryStorePublic;
  input: Input;
  upserted: UpsertPayload<SingleMutationChangesForName<S, MutationName>>;
};

export type OptimisticUpdateHookParams<Input> = {
  store: OptimisticQueryStorePublic;
  input: Input;
};

export type MutationOptions<
  S extends ClientSchema,
  MutationName extends MutationNameFor<S>,
  MutationInput extends MutationPayloadFor<S, MutationName>,
  MutationParams extends Record<string, any>,
> = {
  mutationKey: string;
  mutation: (params: MutationParams) => MutationInput;
  onOptimisticUpdate?: (params: OptimisticUpdateHookParams<MutationInput>) => void | Promise<void>;
  onInsert?: (params: InsertHookParams<MutationInput, S, MutationName>) => void;
  onUpdate?: (params: UpdateHookParams<MutationInput, S, MutationName>) => void;
  onUpsert?: (params: UpsertHookParams<MutationInput, S, MutationName>) => void;
  onDelete?: (params: DeleteHookParams<MutationInput, S, MutationName>) => void;
};
