import type { MutationCacheOptions, ResolverCacheOptions } from './plugin.js';
export type { MutationCacheController } from './cache-controller.js';
export type { MutationCacheOptions, ResolverCacheOptions } from './plugin.js';

declare module '../../extensions.js' {
  interface QuerySingleOptionsExtensions<QueryArgs> {
    cache?: ResolverCacheOptions<QueryArgs>;
  }

  interface QueryManyOptionsExtensions<QueryArgs, PagingInputArgs> {
    cache?: ResolverCacheOptions<QueryArgs & { pagingInfo?: PagingInputArgs }>;
  }

  interface IncludeSingleOptionsExtensions<QueryArgs> {
    cache?: ResolverCacheOptions<QueryArgs>;
  }

  interface IncludeManyOptionsExtensions<QueryArgs> {
    cache?: ResolverCacheOptions<QueryArgs>;
  }

  interface ExternalFieldOptionsExtensions<SchemaContext, Entity, Value> {
    cache?: ResolverCacheOptions<{}>;
  }

  interface MutationOptionsExtensions<Input, Output, SchemaContext> {
    cache?: MutationCacheOptions<Input, Output, SchemaContext>;
  }
}
