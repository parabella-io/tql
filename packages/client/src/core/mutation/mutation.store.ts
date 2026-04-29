import type { FormattedTQLServerError } from '@tql/server/shared';
import { immer } from 'zustand/middleware/immer';
import { createStore, StoreApi } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';
import { Mutate } from 'zustand';

type WithSelector = [['zustand/subscribeWithSelector', never]];

export type MutationState = {
  mutationName: string;
  mutationKey: string;
  mutationInput: any;
  mutationHashKey: string;
  isLoading: boolean;
  isSuccess: boolean | null;
  isError: boolean;
  changes: Record<string, any> | null;
  error: FormattedTQLServerError | null;
};

export type MutationStoreState = {
  state: Record<string, MutationState>;
};

export type MutationStoreActions = {
  setState: (mutationKey: string, mutationState: MutationState) => void;
  reset: () => void;
};

export type MutationStore = Mutate<StoreApi<MutationStoreState & MutationStoreActions>, WithSelector>;

export const createMutationStore = (): MutationStore => {
  return createStore<MutationStoreState & MutationStoreActions>()(
    subscribeWithSelector(
      immer((set) => ({
        state: {},
        setState: (mutationKey: string, mutationState: MutationState) =>
          set((state) => {
            state.state[mutationKey] = mutationState;
          }),
        reset: () => set({ state: {} }),
      })),
    ),
  );
};
