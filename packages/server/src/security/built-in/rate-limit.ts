import { TQLServerError, TQLServerErrorType } from '../../errors.js';
import type { MutationPlan, QueryPlan } from '../plan.js';
import type { SecurityContext, SecurityPolicy } from '../policy.js';
import type { RateLimitStore } from '../store/rate-limit-store.js';

export type RateLimitBucket = {
  scope: 'global' | 'route' | 'op';
  capacity: number;
  refillPerSec: number;
};

export type RateLimitPolicyOptions = {
  store: RateLimitStore;
  buckets: RateLimitBucket[];
  keyPrefix?: string;
};

export const rateLimitPolicy = (options: RateLimitPolicyOptions): SecurityPolicy => ({
  name: 'rate-limit',
  async beforeQuery(ctx, plan) {
    await consumeBuckets(ctx, options, 'query', plan);
  },
  async beforeMutation(ctx, plan) {
    await consumeBuckets(ctx, options, 'mutation', plan);
  },
});

const consumeBuckets = async (
  ctx: SecurityContext,
  options: RateLimitPolicyOptions,
  route: 'query' | 'mutation',
  plan: QueryPlan | MutationPlan,
): Promise<void> => {
  const principal = ctx.principal?.id ?? 'anon';

  const baseCost = Math.max(1, Math.ceil(ctx.costs.staticCost ?? plan.staticCost ?? 1));

  for (const bucket of options.buckets) {
    const keys = getKeys({ prefix: options.keyPrefix, principal, route, bucket, plan });

    for (const key of keys) {
      const result = await options.store.consume(key, baseCost, {
        capacity: bucket.capacity,
        refillPerSec: bucket.refillPerSec,
      });

      if (!result.allowed) {
        throw new TQLServerError(TQLServerErrorType.SecurityRateLimitedError, {
          key,
          remaining: result.remaining,
          retryAfterMs: result.retryAfterMs,
        });
      }
    }
  }
};

const getKeys = (options: {
  prefix?: string;
  principal: string;
  route: 'query' | 'mutation';
  bucket: RateLimitBucket;
  plan: QueryPlan | MutationPlan;
}): string[] => {
  const prefix = options.prefix ? `${options.prefix}:` : '';

  const base = `${prefix}${options.principal}`;

  if (options.bucket.scope === 'global') {
    return [`${base}:global`];
  }

  if (options.bucket.scope === 'route') {
    return [`${base}:${options.route}`];
  }

  if (options.plan.kind === 'query') {
    return options.plan.nodes.map((node) => `${base}:query:${node.queryName}`);
  }

  return options.plan.entries.map((entry) => `${base}:mutation:${entry.mutationName}`);
};
