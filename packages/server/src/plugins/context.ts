import type { PluginContextExtensions } from './extensions.js';

export type AggregateCost = {
  staticCost?: number;
  actualCost?: number;
};

export type ServerContext = {
  request: unknown;
  body: unknown;
  schemaContext: unknown;
  signal: AbortSignal;
  resolverTimeouts: Map<string, number>;
  plugin: PluginContextExtensions;
};

