import { allowedShapesPolicy } from '../../security/built-in/allowed-shapes.js';
import type { AllowedShapesMap } from '../../security/shape-subset.js';
import type { Principal } from '../../security/plan.js';
import type { SecurityContext, SecurityPolicy } from '../../security/policy.js';
import type { SecurityLogger } from '../../security/config.js';
import type { AggregateCost } from '../context.js';
import { definePlugin, type ServerPlugin } from '../plugin.js';
import type {
  IncludeManyOptionsExtensions,
  IncludeSingleOptionsExtensions,
  MutationOptionsExtensions,
  PluginContextExtensions,
  QueryManyOptionsExtensions,
  QuerySingleOptionsExtensions,
} from '../extensions.js';

export type ResolverSecurityOptions<QueryArgs = unknown, PagingInputArgs = void> = {
  /**
   * Static cost for this resolver node, or a function evaluated against
   * validated query inputs before the resolver runs.
   */
  complexity?: number | ((args: { query: QueryArgs; pagingInfo: PagingInputArgs }) => number);
  /**
   * Per-resolver timeout in milliseconds. The request-level deadline still
   * caps this value.
   */
  timeoutMs?: number;
};

export type SecurityPluginConfig = {
  getPrincipal?: (request: unknown, schemaContext: unknown) => Principal | null | Promise<Principal | null>;
  policies?: SecurityPolicy[];
  requestTimeoutMs?: number;
  allowedShapes?: AllowedShapesMap;
  allowedShapesMode?: 'enforce' | 'warn';
  logger?: SecurityLogger;
};

declare module '../extensions.js' {
  interface QuerySingleOptionsExtensions<QueryArgs> {
    security?: ResolverSecurityOptions<QueryArgs>;
  }

  interface QueryManyOptionsExtensions<QueryArgs, PagingInputArgs> {
    security?: ResolverSecurityOptions<QueryArgs, PagingInputArgs>;
  }

  interface IncludeSingleOptionsExtensions<QueryArgs> {
    security?: ResolverSecurityOptions<QueryArgs>;
  }

  interface IncludeManyOptionsExtensions<QueryArgs> {
    security?: ResolverSecurityOptions<QueryArgs>;
  }

  interface MutationOptionsExtensions<Input> {
    security?: ResolverSecurityOptions<Input>;
  }

  interface PluginContextExtensions {
    principal: Principal | null;
    costs: AggregateCost;
    allowedShapesMode?: 'enforce' | 'warn';
  }
}

export const securityPlugin = (config: SecurityPluginConfig): ServerPlugin => {
  const policies = [...(config.policies ?? [])];

  if (config.allowedShapes) {
    policies.unshift(
      allowedShapesPolicy({
        shapes: config.allowedShapes,
        mode: config.allowedShapesMode ?? 'enforce',
        logger: config.logger,
      }),
    );
  }

  return definePlugin({
    name: 'security',
    requestTimeoutMs: config.requestTimeoutMs,
    async createPluginContext({ request, schemaContext }) {
      const principal = (await config.getPrincipal?.(request, schemaContext)) ?? null;

      return {
        principal,
        costs: {},
        allowedShapesMode: config.allowedShapesMode,
      };
    },
    async beforeQuery(ctx, plan) {
      const securityContext = toSecurityContext(ctx);

      for (const policy of policies) {
        await policy.beforeQuery?.(securityContext, plan);
      }
    },
    async beforeMutation(ctx, plan) {
      const securityContext = toSecurityContext(ctx);

      for (const policy of policies) {
        await policy.beforeMutation?.(securityContext, plan);
      }
    },
    async afterQuery(ctx, plan, result) {
      const securityContext = toSecurityContext(ctx);

      for (const policy of policies) {
        await policy.afterQuery?.(securityContext, plan, result);
      }
    },
    async afterMutation(ctx, plan, result) {
      const securityContext = toSecurityContext(ctx);

      for (const policy of policies) {
        await policy.afterMutation?.(securityContext, plan, result);
      }
    },
  });
};

const toSecurityContext = (ctx: {
  request: unknown;
  body: unknown;
  schemaContext: unknown;
  signal: AbortSignal;
  resolverTimeouts: Map<string, number>;
  plugin: PluginContextExtensions;
}): SecurityContext => {
  ctx.plugin.costs ??= {};

  return {
    principal: ctx.plugin.principal ?? null,
    rawRequest: ctx.request,
    body: ctx.body,
    schemaContext: ctx.schemaContext,
    signal: ctx.signal,
    resolverTimeouts: ctx.resolverTimeouts,
    costs: ctx.plugin.costs,
  };
};

