/**
 * Aggregate constraint type that resolvers, the {@link Server}, and the
 * `@parabella-io/tql-client` runtime are parameterized by. Codegen (`generateSchema`)
 * emits a concrete `ClientSchema` interface in the user's project that
 * satisfies this shape; passing it as the single generic to
 * `QueryResolver`, `MutationResolver`, `Server`, or `Client` is enough to
 * recover full type information for handle calls.
 *
 * Includes the per-query / per-mutation registries used by the projection
 * helpers to derive response data from the user's actual `select` /
 * `include` shape.
 */
export type ClientSchema = {
  QueryInputMap: Record<string, any>;
  QueryResponseMap: Record<string, any>;
  QueryRegistry: Record<string, any>;
  MutationInputMap: Record<string, any>;
  MutationOutputMap: Record<string, any>;
  MutationResponseMap: Record<string, any>;
  SchemaEntities: Record<string, any>;
};
