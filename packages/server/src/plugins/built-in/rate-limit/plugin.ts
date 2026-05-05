import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { IRateLimiterOptions, RateLimiterLike } from 'rate-limiter-flexible';
import { TQLServerError, TQLServerErrorType } from '../../../errors.js';
import type { IncludeNode, MutationPlan, QueryNode, QueryPlan } from '../../../request-plan/plan.js';
import { definePlugin, type ServerPlugin } from '../../plugin.js';

export type ResolverRateLimitOptions = {
  cost?: number;
};

export type RateLimitPluginOptions = {
  getIdentity: (request: unknown, context: unknown) => string | null | undefined;
  limiter: IRateLimiterOptions | RateLimiterLike;
  defaultCost?: number;
  keyPrefix?: string;
};

export const rateLimitPlugin = (options: RateLimitPluginOptions): ServerPlugin => {
  const limiter = createLimiter(options.limiter);

  const defaultCost = options.defaultCost ?? 1;

  return definePlugin({
    name: 'rate-limit',
    async beforeQuery(ctx, plan) {
      await consumePlanCost({
        limiter,
        key: getIdentityKey({
          identity: options.getIdentity(ctx.request, ctx.schemaContext) ?? 'anon',
          keyPrefix: options.keyPrefix,
        }),
        cost: getQueryPlanCost(plan, defaultCost),
      });
    },
    async beforeMutation(ctx, plan) {
      await consumePlanCost({
        limiter,
        key: getIdentityKey({
          identity: options.getIdentity(ctx.request, ctx.schemaContext) ?? 'anon',
          keyPrefix: options.keyPrefix,
        }),
        cost: getMutationPlanCost(plan, defaultCost),
      });
    },
  });
};

const getQueryPlanCost = (plan: QueryPlan, defaultCost: number): number =>
  plan.nodes.reduce((sum, node) => sum + getNodeCost(node, defaultCost), 0);

const getNodeCost = (node: QueryNode | IncludeNode, defaultCost: number): number =>
  getResolverCost(getResolverRateLimit(node.extensions), defaultCost) +
  node.includes.reduce((sum, include) => sum + getNodeCost(include, defaultCost), 0);

const getMutationPlanCost = (plan: MutationPlan, defaultCost: number): number =>
  plan.entries.reduce((sum, entry) => sum + getResolverCost(getResolverRateLimit(entry.extensions), defaultCost), 0);

const getResolverCost = (rateLimit: ResolverRateLimitOptions | undefined, defaultCost: number): number =>
  Math.max(0, rateLimit?.cost ?? defaultCost);

const getResolverRateLimit = (extensions: unknown): ResolverRateLimitOptions | undefined => {
  return (extensions as { rateLimit?: ResolverRateLimitOptions }).rateLimit;
};

const consumePlanCost = async (options: { limiter: RateLimiterLike; key: string; cost: number }): Promise<void> => {
  if (options.cost <= 0) {
    return;
  }

  try {
    await options.limiter.consume(options.key, options.cost);
  } catch (error) {
    if (!isRateLimiterRejection(error)) {
      throw error;
    }

    throw new TQLServerError(TQLServerErrorType.SecurityRateLimitedError, {
      key: options.key,
      remaining: Math.max(0, Math.floor(error.remainingPoints)),
      retryAfterMs: Math.max(0, Math.ceil(error.msBeforeNext)),
    });
  }
};

const getIdentityKey = (options: { identity: string; keyPrefix?: string }): string => {
  const prefix = options.keyPrefix ? `${options.keyPrefix}:` : '';

  return `${prefix}${options.identity}`;
};

const isRateLimiterRejection = (error: unknown): error is { remainingPoints: number; msBeforeNext: number } =>
  typeof error === 'object' &&
  error !== null &&
  'remainingPoints' in error &&
  typeof error.remainingPoints === 'number' &&
  'msBeforeNext' in error &&
  typeof error.msBeforeNext === 'number';

const createLimiter = (limiter: IRateLimiterOptions | RateLimiterLike): RateLimiterLike => {
  if (isRateLimiterLike(limiter)) {
    return limiter;
  }

  return new RateLimiterMemory(limiter);
};

const isRateLimiterLike = (limiter: IRateLimiterOptions | RateLimiterLike): limiter is RateLimiterLike =>
  typeof (limiter as Partial<RateLimiterLike>).consume === 'function';
