import type { MutationPlan, Principal, QueryPlan } from './plan.js';

export type AggregateCost = {
  staticCost?: number;
  actualCost?: number;
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

