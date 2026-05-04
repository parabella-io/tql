import type { FormattedTQLServerError } from '../errors.js';

export type MutationOutputFromMap<OutputMap, K extends keyof OutputMap> = OutputMap[K];

/**
 * Per-call mutation response shape. Mirrors the runtime envelope
 * `{ data, error }` per requested key.
 */
export type HandleMutationResponseFor<OutputMap, InputMap, Q extends Partial<InputMap>> = {
  [K in keyof Q & keyof OutputMap]: {
    data: OutputMap[K];
    error: FormattedTQLServerError | null;
  };
};

/**
 * Fixed per-mutation response map. Each key resolves to the mutation's output
 * shape wrapped in the transport envelope.
 */
export type MutationResponseMapFor<OutputMap, InputMap> = {
  [K in keyof InputMap & keyof OutputMap]: {
    data: OutputMap[K];
    error: FormattedTQLServerError | null;
  };
};
