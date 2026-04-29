import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { Mutation } from '../core/mutation/mutation';
import type { SingleMutationChangesForName } from '../core/mutation/mutation.types';
import { MutationState } from '../core/mutation/mutation.store';

type AnyMutation = Mutation<any, any, any, any>;

type MutationParamsFor<MutationType extends AnyMutation> = MutationType extends Mutation<any, any, any, infer Params> ? Params : never;

type MutationChangesFor<MutationType extends AnyMutation> =
  MutationType extends Mutation<infer S, infer MutationName, any, any> ? SingleMutationChangesForName<S, MutationName> : never;

type UseMutationResult<MutationType extends AnyMutation> = {
  mutate: (params: MutationParamsFor<MutationType>) => Promise<MutationChangesFor<MutationType>>;
  mutationInput: MutationState['mutationInput'];
  error: MutationState['error'];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const noopUnsubscribe = () => {};

export const useMutation = <MutationType extends AnyMutation>(options: { mutation: MutationType }): UseMutationResult<MutationType> => {
  const { mutation } = options;

  const [params, setParams] = useState<MutationParamsFor<MutationType> | null>(null);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!params) return noopUnsubscribe;
      return mutation.subscribe(params, () => callback());
    },
    [mutation, params],
  );

  const getSnapshot = useCallback(() => {
    if (!params) return null;
    return mutation.getStateOrNull(params) ?? null;
  }, [mutation, params]);

  const state = useSyncExternalStore(subscribe, getSnapshot, () => null) as MutationState | null;

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
