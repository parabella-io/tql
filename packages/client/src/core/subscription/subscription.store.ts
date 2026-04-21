import type { FormattedTQLServerError } from '@tql/server/shared';
import { immer } from 'zustand/middleware/immer';
import { createStore, StoreApi } from 'zustand/vanilla';
import stableStringify from 'fast-json-stable-stringify';
import md5 from 'md5';

export type SubscriptionStatus = 'idle' | 'subscribing' | 'active' | 'error' | 'closed';

export type SubscriptionState = {
  subscriptionName: string;
  subscriptionKey: string;
  subscriptionHashKey: string;
  args: any;
  subscriptionId: string | null;
  status: SubscriptionStatus;
  error: FormattedTQLServerError | null;
  lastBatchAt: number | null;
};

export type SubscriptionStoreState = {
  state: Record<string, SubscriptionState>;
};

export type SubscriptionStoreActions = {
  setState: (hashKey: string, state: SubscriptionState) => void;
  patch: (hashKey: string, patch: Partial<SubscriptionState>) => void;
  remove: (hashKey: string) => void;
  reset: () => void;
};

export type SubscriptionStore = StoreApi<SubscriptionStoreState & SubscriptionStoreActions>;

export const createSubscriptionStore = (): SubscriptionStore => {
  return createStore<SubscriptionStoreState & SubscriptionStoreActions>()(
    immer((set) => ({
      state: {},
      setState: (hashKey, next) =>
        set((draft) => {
          draft.state[hashKey] = next;
        }),
      patch: (hashKey, patchValues) =>
        set((draft) => {
          const current = draft.state[hashKey];
          if (!current) return;
          Object.assign(current, patchValues);
        }),
      remove: (hashKey) =>
        set((draft) => {
          delete draft.state[hashKey];
        }),
      reset: () => set({ state: {} }),
    })),
  );
};

export const createSubscriptionHashKey = (subscriptionKey: string, args: unknown): string => {
  return md5(stableStringify({ subscriptionKey, args }));
};
