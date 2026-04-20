import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { Mutation } from '../core/mutation/mutation';
import type { SingleMutationChangesForName } from '../core/mutation/mutation.types';
import { MutationState } from '../core/mutation/mutation.store';

type AnyMutation = Mutation<any, any, any, any>;

type MutationParamsFor<MutationType extends AnyMutation> = MutationType extends Mutation<any, any, any, infer Params> ? Params : never;

type MutationChangesFor<MutationType extends AnyMutation> =
  MutationType extends Mutation<infer S, infer MutationName, any, any>
    ? SingleMutationChangesForName<S, MutationName>
    : never;

type UseMutationResult<MutationType extends AnyMutation> = {
  mutate: (params: MutationParamsFor<MutationType>) => Promise<MutationChangesFor<MutationType>>;
  mutationInput: MutationState['mutationInput'];
  error: MutationState['error'];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export const useMutation = <MutationType extends AnyMutation>(options: { mutation: MutationType }): UseMutationResult<MutationType> => {
  const { mutation } = options;

  const [params, setParams] = useState<MutationParamsFor<MutationType> | null>(null);

  const state = useSyncExternalStore(
    (callback) => mutation.subscribeAll(callback),
    () => {
      if (!params) {
        return null;
      }

      return mutation.getStateOrNull(params) ?? null;
    },
    () => null,
  ) as MutationState | null;

  const mutate = useCallback(
    async (nextParams: MutationParamsFor<MutationType>) => {
      setParams(nextParams);

      return mutation.execute(nextParams);
    },
    [mutation],
  );

  return useMemo(
    () =>
      ({
        mutate,
        mutationInput: state?.mutationInput ?? null,
        error: state?.error ?? null,
        isLoading: state?.isLoading ?? false,
        isSuccess: state?.isSuccess ?? false,
        isError: state?.isError ?? false,
      }) as UseMutationResult<MutationType>,
    [mutate, state],
  );
};
