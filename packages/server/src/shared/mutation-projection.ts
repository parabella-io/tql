import type { FormattedTQLServerError } from '../errors.js';

import type { ClientSchema } from './client-schema.js';
import type { MutationOp, Remove__Model, WithId } from './projection.js';

/**
 * Entity shape for a mutation `changes` payload row, parameterized on a
 * `SchemaEntities`-shaped lookup directly. *Retains* the `__model` brand —
 * used by the codegen-emitted `MutationChanges` so resolver classes (and
 * any server-side runtime test harness) can still observe it.
 */
export type ChangesEntityFromMap<Entities, ModelName> = ModelName extends keyof Entities ? WithId<Entities[ModelName]> : never;

/**
 * Client-facing convenience wrapper around {@link ChangesEntityFromMap}
 * parameterized by the aggregate {@link ClientSchema} and *stripped* of
 * the `__model` brand for end-user consumption.
 */
export type EntityWithId<S extends ClientSchema, ModelName> = Remove__Model<ChangesEntityFromMap<S['SchemaEntities'], ModelName>>;

/**
 * Per-mutation `changes` shape derived from `MutationRegistry` +
 * `SchemaEntities`. Each touched model maps to an
 * `{ inserts?, updates?, upserts?, deletes? }` object that only contains
 * the ops the mutation actually declares as changed.
 *
 * Schema-agnostic, retains `__model`.
 */
export type MutationChangesFromRegistry<Registry, Entities, K extends keyof Registry> = {
  [Model in keyof Registry[K] & keyof Entities]: {
    [Op in keyof Registry[K][Model] & MutationOp as Registry[K][Model][Op] extends true ? Op : never]?: ChangesEntityFromMap<
      Entities,
      Model
    >[];
  };
};

/**
 * Client-facing convenience wrapper around {@link MutationChangesFromRegistry}
 * parameterized by the aggregate {@link ClientSchema}, with `__model`
 * stripped so consumers don't see the codegen-only marker.
 */
export type MutationChangesFor<S extends ClientSchema, K extends keyof S['MutationRegistry']> = {
  [Model in keyof S['MutationRegistry'][K] & keyof S['SchemaEntities']]: {
    [Op in keyof S['MutationRegistry'][K][Model] & MutationOp as S['MutationRegistry'][K][Model][Op] extends true
      ? Op
      : never]?: EntityWithId<S, Model>[];
  };
};

/**
 * Per-call mutation response shape. Mirrors the runtime envelope
 * `{ changes, error }` per requested key.
 */
export type HandleMutationResponseFor<Registry, Entities, InputMap, Q extends Partial<InputMap>> = {
  [K in keyof Q & keyof Registry]: {
    changes: MutationChangesFromRegistry<Registry, Entities, K>;
    error: FormattedTQLServerError | null;
  };
};

/**
 * Fixed per-mutation response map. Each key resolves to the full
 * `MutationChangesFromRegistry<Registry, Entities, K>` for that mutation.
 * Resolver classes use this for their bulk return type while preserving
 * per-key projection.
 */
export type MutationResponseMapFor<Registry, Entities, InputMap> = {
  [K in keyof InputMap & keyof Registry]: {
    changes: MutationChangesFromRegistry<Registry, Entities, K>;
    error: FormattedTQLServerError | null;
  };
};
