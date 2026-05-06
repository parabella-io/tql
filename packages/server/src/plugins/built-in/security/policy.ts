import type { AggregateCost } from '../../context.js';
import type { MutationPlan, QueryPlan } from '../../../request-plan/plan.js';

export type Principal = {
  id: string;
  tier?: string;
  meta?: Record<string, unknown>;
};

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

export type SecurityContext = {
  principal: Principal | null;
  rawRequest: unknown;
  body: unknown;
  schemaContext: unknown;
  signal: AbortSignal;
  resolverTimeouts: Map<string, number>;
  costs: AggregateCost;
};

export interface SecurityPolicy {
  name: string;
  beforeQuery?(ctx: SecurityContext, plan: QueryPlan): Promise<void> | void;
  beforeMutation?(ctx: SecurityContext, plan: MutationPlan): Promise<void> | void;
  afterQuery?(ctx: SecurityContext, plan: QueryPlan, result: AggregateCost): Promise<void> | void;
  afterMutation?(ctx: SecurityContext, plan: MutationPlan, result: AggregateCost): Promise<void> | void;
}

export const getResolverSecurity = (extensions: unknown): ResolverSecurityOptions<any, any> | undefined => {
  return (extensions as { security?: ResolverSecurityOptions<any, any> }).security;
};
