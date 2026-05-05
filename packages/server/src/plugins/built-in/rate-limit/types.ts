import type { ResolverRateLimitOptions } from './plugin.js';

export type { ResolverRateLimitOptions } from './plugin.js';

declare module '../../extensions.js' {
  interface QuerySingleOptionsExtensions<QueryArgs> {
    rateLimit?: ResolverRateLimitOptions;
  }

  interface QueryManyOptionsExtensions<QueryArgs, PagingInputArgs> {
    rateLimit?: ResolverRateLimitOptions;
  }

  interface IncludeSingleOptionsExtensions<QueryArgs> {
    rateLimit?: ResolverRateLimitOptions;
  }

  interface IncludeManyOptionsExtensions<QueryArgs> {
    rateLimit?: ResolverRateLimitOptions;
  }

  interface MutationOptionsExtensions<Input> {
    rateLimit?: ResolverRateLimitOptions;
  }
}
