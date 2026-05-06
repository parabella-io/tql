import { TQLServerError, TQLServerErrorType } from '../../../../errors.js';
import type { IncludeNode, MutationPlan, QueryNode, QueryPlan } from '../../../../request-plan/plan.js';
import { getResolverSecurity, type SecurityContext, type SecurityPolicy } from '../policy.js';

export const depthPolicy = (options: { maxDepth: number }): SecurityPolicy => ({
  name: 'depth',
  beforeQuery(_ctx, plan) {
    if (plan.maxDepth > options.maxDepth) {
      throw new TQLServerError(TQLServerErrorType.SecurityDepthExceededError, {
        maxDepth: options.maxDepth,
        actualDepth: plan.maxDepth,
      });
    }
  },
});

export const breadthPolicy = (options: {
  maxIncludesPerNode?: number;
  maxTotalIncludes?: number;
  maxSelectKeys?: number;
}): SecurityPolicy => ({
  name: 'breadth',
  beforeQuery(_ctx, plan) {
    const totalIncludes = Math.max(0, plan.totalNodes - plan.nodes.length);

    if (options.maxTotalIncludes !== undefined && totalIncludes > options.maxTotalIncludes) {
      throw new TQLServerError(TQLServerErrorType.SecurityBreadthExceededError, {
        limit: options.maxTotalIncludes,
        actual: totalIncludes,
        kind: 'total-includes',
      });
    }

    walkQueryPlan(plan, (node) => {
      if (options.maxIncludesPerNode !== undefined && node.includes.length > options.maxIncludesPerNode) {
        throw new TQLServerError(TQLServerErrorType.SecurityBreadthExceededError, {
          limit: options.maxIncludesPerNode,
          actual: node.includes.length,
          kind: 'includes-per-node',
          path: node.path,
        });
      }

      if (options.maxSelectKeys !== undefined && node.selectKeys.length > options.maxSelectKeys) {
        throw new TQLServerError(TQLServerErrorType.SecurityBreadthExceededError, {
          limit: options.maxSelectKeys,
          actual: node.selectKeys.length,
          kind: 'select-keys',
          path: node.path,
        });
      }
    });
  },
});

export const batchPolicy = (options: { maxQueriesPerRequest?: number; maxMutationsPerRequest?: number }): SecurityPolicy => ({
  name: 'batch',
  beforeQuery(_ctx, plan) {
    if (options.maxQueriesPerRequest !== undefined && plan.nodes.length > options.maxQueriesPerRequest) {
      throw new TQLServerError(TQLServerErrorType.SecurityBatchExceededError, {
        limit: options.maxQueriesPerRequest,
        actual: plan.nodes.length,
        kind: 'query',
      });
    }
  },
  beforeMutation(_ctx, plan) {
    if (options.maxMutationsPerRequest !== undefined && plan.entries.length > options.maxMutationsPerRequest) {
      throw new TQLServerError(TQLServerErrorType.SecurityBatchExceededError, {
        limit: options.maxMutationsPerRequest,
        actual: plan.entries.length,
        kind: 'mutation',
      });
    }
  },
});

export const takePolicy = (options: { defaultMax: number; perQueryOverrides?: Record<string, number> }): SecurityPolicy => ({
  name: 'take',
  beforeQuery(_ctx, plan) {
    for (const node of plan.nodes) {
      const maxTake = options.perQueryOverrides?.[node.queryName] ?? options.defaultMax;

      if (node.pagingInfo && node.pagingInfo.take > maxTake) {
        throw new TQLServerError(TQLServerErrorType.SecurityTakeExceededError, {
          queryName: node.queryName,
          path: node.path,
          limit: maxTake,
          actual: node.pagingInfo.take,
        });
      }
    }
  },
});

export const bodyLimitPolicy = (options: { maxBytes: number }): SecurityPolicy => ({
  name: 'body-limit',
  beforeQuery(ctx) {
    assertBodyBytes(ctx, options.maxBytes);
  },
  beforeMutation(ctx) {
    assertBodyBytes(ctx, options.maxBytes);
  },
});

export const timeoutPolicy = (options: {
  requestTimeoutMs?: number;
  perResolverTimeoutMs?: number;
  perOp?: Record<string, number>;
}): SecurityPolicy => ({
  name: 'timeout',
  beforeQuery(ctx, plan) {
    walkQueryPlan(plan, (node) => {
      const opName = 'queryName' in node ? node.queryName : node.includeName;
      const timeoutMs =
        getResolverSecurity(node.extensions)?.timeoutMs ??
        options.perOp?.[node.path] ??
        options.perOp?.[opName] ??
        options.perResolverTimeoutMs;

      if (timeoutMs !== undefined) {
        ctx.resolverTimeouts.set(node.path, timeoutMs);
      }
    });
  },
  beforeMutation(ctx, plan) {
    for (const entry of plan.entries) {
      const timeoutMs =
        getResolverSecurity(entry.extensions)?.timeoutMs ?? options.perOp?.[entry.mutationName] ?? options.perResolverTimeoutMs;

      if (timeoutMs !== undefined) {
        ctx.resolverTimeouts.set(entry.mutationName, timeoutMs);
      }
    }
  },
});

export const compileShapePolicies = (options: {
  depth?: Parameters<typeof depthPolicy>[0];
  breadth?: Parameters<typeof breadthPolicy>[0];
  batch?: Parameters<typeof batchPolicy>[0];
  take?: Parameters<typeof takePolicy>[0];
  bodyLimit?: Parameters<typeof bodyLimitPolicy>[0];
  timeout?: Parameters<typeof timeoutPolicy>[0];
}): SecurityPolicy => {
  const policies = [
    options.bodyLimit ? bodyLimitPolicy(options.bodyLimit) : null,
    options.batch ? batchPolicy(options.batch) : null,
    options.depth ? depthPolicy(options.depth) : null,
    options.breadth ? breadthPolicy(options.breadth) : null,
    options.take ? takePolicy(options.take) : null,
    options.timeout ? timeoutPolicy(options.timeout) : null,
  ].filter((policy): policy is SecurityPolicy => policy !== null);

  return {
    name: 'shape',
    async beforeQuery(ctx, plan) {
      for (const policy of policies) {
        await policy.beforeQuery?.(ctx, plan);
      }
    },
    async beforeMutation(ctx, plan) {
      for (const policy of policies) {
        await policy.beforeMutation?.(ctx, plan);
      }
    },
  };
};

const assertBodyBytes = (ctx: SecurityContext, maxBytes: number): void => {
  const bytes = Buffer.byteLength(JSON.stringify(ctx.body ?? null), 'utf8');

  if (bytes > maxBytes) {
    throw new TQLServerError(TQLServerErrorType.SecurityBodySizeExceededError, {
      limit: maxBytes,
      actual: bytes,
    });
  }
};

const walkQueryPlan = (plan: QueryPlan, visitor: (node: QueryNode | IncludeNode) => void): void => {
  const visit = (node: QueryNode | IncludeNode) => {
    visitor(node);
    for (const include of node.includes) visit(include);
  };

  for (const node of plan.nodes) visit(node);
};
