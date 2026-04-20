import type { FormattedTQLServerError } from '@tql/server/shared';
import { immer } from 'zustand/middleware/immer';
import { createStore, StoreApi } from 'zustand/vanilla';

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

export type MutationStore = StoreApi<MutationStoreState & MutationStoreActions>;

export const createMutationStore = (): MutationStore => {
  return createStore<MutationStoreState & MutationStoreActions>()(
    immer((set) => ({
      state: {},
      setState: (mutationKey: string, mutationState: MutationState) =>
        set((state) => {
          state.state[mutationKey] = mutationState;
        }),
      reset: () => set({ state: {} }),
    })),
  );
};
