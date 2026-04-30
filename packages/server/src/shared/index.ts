// Public, isomorphic surface for apps/clients.
//
// Important: this module must not import any server-runtime values (e.g.
// Schema/Model). It should only export types (erased at runtime) plus
// lightweight shared values like error enums.
//
// Both the codegen output (in user projects) and the `@tql/client` runtime
// import from this module so the projection rules and aggregate
// `ClientSchema` constraint live in exactly one place.

export { TQLServerErrorType } from '../errors.js';

export type { FormattedTQLServerError } from '../errors.js';

export type { QueryResolver, ApplyQueryResponseMap } from '../query/query-resolver.js';
export type { MutationResolver, ApplyMutationResponseMap } from '../mutation/mutation-resolver.js';

export type { MutationResolveResult } from '../mutation/mutation.js';

export type { ClientSchema } from './client-schema.js';

export type {
  IncludeKind,
  IncludeNodeMarker,
  MutationOp,
  WithId,
  ExtractSelect,
  ExtractInclude,
  GetNestedIncludeMap,
  Selected,
  IncludeProjection,
  ResolveIncludeNode,
  Remove__Model,
} from './projection.js';

export type {
  QueryRegistryEntry,
  ResolvedPagingInfoShape,
  QueryDataFor,
  QueryDataFromRegistry,
  QueryPagingInfoFromRegistry,
  HandleQueryResponseFor,
  QueryResponseMapFor,
} from './query-projection.js';

export type {
  EntityWithId,
  ChangesEntityFromMap,
  MutationChangesFor,
  MutationChangesFromRegistry,
  HandleMutationResponseFor,
  MutationResponseMapFor,
} from './mutation-projection.js';
