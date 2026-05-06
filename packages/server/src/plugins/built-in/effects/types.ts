import type { PendingMutationEffect } from './pending-effect.js';
import type { ResolveMutationEffect } from './plugin.js';

export type { PendingMutationEffect } from './pending-effect.js';
export type { ResolveMutationEffect } from './plugin.js';

declare module '../../extensions.js' {
  interface MutationOptionsExtensions<Input, Output, SchemaContext> {
    resolveEffects?: ResolveMutationEffect<Input, Output, SchemaContext>;
  }

  interface PluginContextExtensions {
    pendingMutationEffects?: PendingMutationEffect[];
  }
}
