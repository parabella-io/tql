import type { TQLServerError } from '../errors.js';
import type { Logger } from '../logging/index.js';
import type { IncludeNode, MutationPlan, QueryNode, QueryPlan } from '../request-plan/plan.js';
import type { AggregateCost, ServerContext } from './context.js';
import type { PluginContextExtensions, SchemaContextExtensions } from './extensions.js';

export type ServerLike = {
  log: Logger;
};

export type QueryAfterHookArgs = {
  ctx: ServerContext;
  plan: QueryPlan;
  result: Record<string, unknown>;
  costs: AggregateCost;
};

export type MutationAfterHookArgs = {
  ctx: ServerContext;
  plan: MutationPlan;
  result: Record<string, { data: unknown; error: unknown }>;
  inputs: Record<string, unknown>;
  costs: AggregateCost;
};

export type PluginSetupHookArgs = {
  server: ServerLike;
};

export type QueryBeforeHookArgs = {
  ctx: ServerContext;
  plan: QueryPlan;
};

export type MutationBeforeHookArgs = {
  ctx: ServerContext;
  plan: MutationPlan;
};

export type QueryResolveHookArgs<T> = {
  ctx: ServerContext;
  node: QueryNode | IncludeNode;
  next: () => Promise<T>;
};

export type MutationResolveHookArgs<T> = {
  ctx: ServerContext;
  entry: MutationPlan['entries'][number];
  next: () => Promise<T>;
};

export type ResponseAfterHookArgs = {
  ctx: ServerContext;
};

export type PluginErrorHookArgs = {
  ctx: ServerContext;
  error: TQLServerError;
};

export interface ServerPlugin {
  name: string;
  /**
   * Optional request-level timeout in milliseconds. The runner uses the
   * smallest value declared by all registered plugins.
   */
  requestTimeoutMs?: number;
  setup?(args: PluginSetupHookArgs): void | Promise<void>;
  createPluginContext?(args: {
    request: unknown;
    body: unknown;
    schemaContext: SchemaContextExtensions;
    signal: AbortSignal;
    pluginContext: Partial<PluginContextExtensions>;
  }): Partial<PluginContextExtensions> | Promise<Partial<PluginContextExtensions>>;
  beforeQuery?(args: QueryBeforeHookArgs): void | Promise<void>;
  beforeMutation?(args: MutationBeforeHookArgs): void | Promise<void>;
  onResolveQueryNode?<T>(args: QueryResolveHookArgs<T>): Promise<T>;
  onResolveMutation?<T>(args: MutationResolveHookArgs<T>): Promise<T>;
  afterQuery?(args: QueryAfterHookArgs): void | Promise<void>;
  afterMutation?(args: MutationAfterHookArgs): void | Promise<void>;
  afterResponse?(args: ResponseAfterHookArgs): void | Promise<void>;
  onError?(args: PluginErrorHookArgs): TQLServerError | void;
}

export const definePlugin = <P extends ServerPlugin>(plugin: P): P => plugin;
