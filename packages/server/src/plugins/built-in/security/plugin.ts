import { allowedShapesPolicy } from './policies/allowed-shapes.js';
import type { AllowedShapesMap } from './shape-subset.js';
import type { Principal, SecurityContext, SecurityPolicy } from './policy.js';
import type { SecurityLogger } from './config.js';
import { definePlugin, type ServerPlugin } from '../../plugin.js';

export type SecurityPluginConfig = {
  getPrincipal?: (request: unknown, schemaContext: unknown) => Principal | null | Promise<Principal | null>;
  policies?: SecurityPolicy[];
  requestTimeoutMs?: number;
  allowedShapes?: AllowedShapesMap;
  allowedShapesMode?: 'enforce' | 'warn';
  logger?: SecurityLogger;
};

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
  plugin: SecurityPluginContext;
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

type SecurityPluginContext = {
  principal?: Principal | null;
  costs?: SecurityContext['costs'];
  allowedShapesMode?: 'enforce' | 'warn';
};
