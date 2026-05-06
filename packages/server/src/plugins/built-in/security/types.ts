import type { AggregateCost } from '../../context.js';

import type { Principal, ResolverSecurityOptions } from './policy.js';

export type { ResolverSecurityOptions } from './policy.js';

declare module '../../extensions.js' {
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

  interface MutationOptionsExtensions<Input, Output, SchemaContext> {
    security?: ResolverSecurityOptions<Input>;
  }

  interface PluginContextExtensions {
    principal: Principal | null;
    costs: AggregateCost;
    allowedShapesMode?: 'enforce' | 'warn';
  }
}
