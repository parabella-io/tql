import type { ClientSchema } from '@parabella-io/tql-server/shared';

import { OptimisticQueryStore } from '../query/query-optimistic-update';
import type { TransportKey } from '../transports';

export type OptimisticQueryStorePublic = Omit<OptimisticQueryStore, 'start' | 'commit' | 'rollback'>;

export type MutationNameFor<S extends ClientSchema> = keyof S['MutationInputMap'] & string;

export type MutationInputFor<S extends ClientSchema, MutationName extends MutationNameFor<S>> = NonNullable<
  S['MutationInputMap'][MutationName]
>;

export type MutationPayloadFor<S extends ClientSchema, MutationName extends MutationNameFor<S>> =
  MutationInputFor<S, MutationName> extends { input: infer Input } ? Input : never;

export type MutationOutputFor<S extends ClientSchema, MutationName extends MutationNameFor<S>> = MutationName extends keyof S['MutationOutputMap']
  ? S['MutationOutputMap'][MutationName]
  : never;

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

export type OptimisticUpdateHookParams<Input> = {
  store: OptimisticQueryStorePublic;
  input: Input;
};

export type OnSuccessHookParams<Input, Output> = {
  store: OptimisticQueryStorePublic;
  input: Input;
  output: Output;
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
  onSuccess?: (params: OnSuccessHookParams<MutationInput, MutationOutputFor<S, MutationName>>) => void | Promise<void>;
  /**
   * Which registered transport should serve this mutation. Defaults to the
   * client's `defaultTransport` (or `'http'`).
   */
  transport?: TransportKey;
};
