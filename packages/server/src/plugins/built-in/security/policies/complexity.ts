import { TQLServerError, TQLServerErrorType } from '../../../../errors.js';
import type { IncludeNode, QueryNode } from '../../../../request-plan/plan.js';
import { getResolverSecurity, type SecurityPolicy } from '../policy.js';

export type ComplexityDefaults = {
  single: number;
  many: number;
  selectKey: number;
};

export type ComplexityPolicyOptions = {
  defaults: ComplexityDefaults;
  perModel?: Record<string, Partial<Pick<ComplexityDefaults, 'single' | 'many'>>>;
  assumedManyTake?: number;
  budget: number | ((args: { principalId: string | null }) => number);
};

export const complexityPolicy = (options: ComplexityPolicyOptions): SecurityPolicy => ({
  name: 'complexity',
  beforeQuery(ctx, plan) {
    const total = plan.nodes.reduce((sum, node) => sum + nodeCost(node, options), 0);
    const budget = typeof options.budget === 'function' ? options.budget({ principalId: ctx.principal?.id ?? null }) : options.budget;

    plan.staticCost = total;
    ctx.costs.staticCost = total;

    if (total > budget) {
      throw new TQLServerError(TQLServerErrorType.SecurityComplexityExceededError, {
        limit: budget,
        actual: total,
      });
    }
  },
  afterQuery(ctx, plan) {
    // Until resolvers expose per-node row metadata, actual cost is the static
    // cost that was admitted for this request. The hook shape is in place for
    // plugging richer execution metrics in later.
    plan.actualCost = plan.staticCost;
    ctx.costs.actualCost = plan.staticCost;
  },
});

const nodeCost = (node: QueryNode | IncludeNode, options: ComplexityPolicyOptions): number => {
  const base = nodeBaseCost(node, options);
  const selectCost = node.selectAll ? options.defaults.selectKey : options.defaults.selectKey * node.selectKeys.length;
  const manyMultiplier = node.kind === 'many' ? getNodeTake(node, options) : 1;
  const includeCost = node.includes.reduce((sum, include) => sum + nodeCost(include, options), 0);
  const total = (base + selectCost + includeCost) * manyMultiplier;

  node.staticCost = total;

  return total;
};

const nodeBaseCost = (node: QueryNode | IncludeNode, options: ComplexityPolicyOptions): number => {
  const override = getResolverSecurity(node.extensions)?.complexity;

  if (typeof override === 'number') {
    return override;
  }

  if (typeof override === 'function') {
    return override({ query: node.query, pagingInfo: 'pagingInfo' in node ? node.pagingInfo : undefined });
  }

  return options.perModel?.[node.modelName]?.[node.kind] ?? options.defaults[node.kind];
};

const getNodeTake = (node: QueryNode | IncludeNode, options: ComplexityPolicyOptions): number => {
  if ('pagingInfo' in node && node.pagingInfo?.take !== undefined) {
    return node.pagingInfo.take;
  }

  return options.assumedManyTake ?? 1;
};
