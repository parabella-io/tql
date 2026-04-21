import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';

import { Subscription } from '../core/subscription/subscription';
import type { SubscriptionState } from '../core/subscription/subscription.store';

type AnySubscription = Subscription<any, any, any>;

type SubscriptionParamsFor<SubscriptionType extends AnySubscription> =
  SubscriptionType extends Subscription<any, any, infer Params> ? Params : never;

type UseSubscriptionResult = {
  status: SubscriptionState['status'] | 'idle';
  subscriptionId: string | null;
  error: SubscriptionState['error'];
  lastBatchAt: number | null;
};

/**
 * Opens a subscription on mount and tears it down on unmount. Returns
 * the live `SubscriptionState` so consumers can render loading /
 * error UI.
 *
 * Effect + store-subscription identity are keyed on the subscription's
 * content-derived hash key rather than the caller-provided `params`
 * object. Consumers routinely inline `params` as a fresh object
 * literal; keying on the hash key prevents a subscribe/unsubscribe
 * cycle on every render, which would otherwise thrash the store and
 * trigger `Maximum update depth exceeded`.
 */
export const useSubscription = <SubscriptionType extends AnySubscription>(options: {
  subscription: SubscriptionType;
  params: SubscriptionParamsFor<SubscriptionType>;
  isEnabled?: boolean;
}): UseSubscriptionResult => {
  const { subscription, params, isEnabled = true } = options;

  const hashKey = subscription.getHashKey(params);

  useEffect(() => {
    if (!isEnabled) return;

    subscription.subscribe(params).catch(() => {
      // Errors land on the subscription state; nothing extra to do here.
    });

    return () => {
      void subscription.unsubscribe(params);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription, hashKey, isEnabled]);

  const subscribe = useCallback(
    (callback: () => void) => subscription.subscribeStore(params, () => callback()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subscription, hashKey],
  );

  const getSnapshot = useCallback(
    () => subscription.getStateOrNull(params) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subscription, hashKey],
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return useMemo(
    () => ({
      status: (state?.status ?? 'idle') as UseSubscriptionResult['status'],
      subscriptionId: state?.subscriptionId ?? null,
      error: state?.error ?? null,
      lastBatchAt: state?.lastBatchAt ?? null,
    }),
    [state],
  );
};
