import type { TQLServerError } from '../errors.js';
import type { IncludeNode, MutationPlan, QueryNode, QueryPlan } from '../security/plan.js';
import type { AggregateCost, ServerContext } from './context.js';
import type { PluginContextExtensions, SchemaContextExtensions } from './extensions.js';

export type ServerLike = {
  log?: {
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
};

export interface ServerPlugin {
  name: string;
  /**
   * Optional request-level timeout in milliseconds. The runner uses the
   * smallest value declared by all registered plugins.
   */
  requestTimeoutMs?: number;
  setup?(server: ServerLike): void | Promise<void>;
  createPluginContext?(args: {
    request: unknown;
    body: unknown;
    schemaContext: SchemaContextExtensions;
    signal: AbortSignal;
  }): Partial<PluginContextExtensions> | Promise<Partial<PluginContextExtensions>>;
  beforeQuery?(ctx: ServerContext, plan: QueryPlan): void | Promise<void>;
  beforeMutation?(ctx: ServerContext, plan: MutationPlan): void | Promise<void>;
  onResolveQueryNode?<T>(args: {
    ctx: ServerContext;
    node: QueryNode | IncludeNode;
    next: () => Promise<T>;
  }): Promise<T>;
  onResolveMutation?<T>(args: {
    ctx: ServerContext;
    entry: MutationPlan['entries'][number];
    next: () => Promise<T>;
  }): Promise<T>;
  afterQuery?(ctx: ServerContext, plan: QueryPlan, result: AggregateCost): void | Promise<void>;
  afterMutation?(ctx: ServerContext, plan: MutationPlan, result: AggregateCost): void | Promise<void>;
  onError?(ctx: ServerContext, error: TQLServerError): TQLServerError | void;
}

export const definePlugin = <P extends ServerPlugin>(plugin: P): P => plugin;

