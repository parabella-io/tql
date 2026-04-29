// @schema-hash 6bd495e09f4f0ce0
/**
 * Auto-generated TQL schema — DO NOT EDIT BY HAND.
 *
 * Mirrors the runtime behaviour of QueryResolver.handle and
 * MutationResolver.handle but as named, non-recursive interfaces so TypeScript
 * resolves each query / mutation in near-O(1) instead of walking the deep
 * `FlattenedQueriesInput` / `FlattenedMutationsInput` generic chains.
 *
 * All projection helpers (`Selected`, `IncludeProjection`, `MutationChanges`,
 * etc.) live in `@tql/server/shared` so the codegen output, the server
 * runtime, and `@tql/client` all share a single source of truth. The file
 * below only emits schema-specific shapes (entities, selects, includes,
 * inputs, registries, and the aggregate `ClientSchema`).
 *
 * Layout:
 *   1. <Model>Entity                    one per registered model, with `__model` brand
 *   2. <Model>ExternalFields            value types for external-only batch fields (own Zod per field)
 *   3. SchemaEntities                   name -> entity lookup (mutation projection)
 *   4. <Model>Select / <Model>SelectMap entity scalars + external scalars
 *   5. <Parent>_<Include>_IncludeNode   one named interface per (parent, include) pair
 *   6. <Model>IncludeMap                map of relation-name -> named IncludeNode
 *   7. <Query>Input + QueryInputMap     per-query envelopes (`query`, `select`, `include?`) and aggregate map
 *   8. QueryRegistry                    queryName -> { entity, kind, nullable, includeMap, externalFieldKeys, externalFields }
 *   9. <Mutation>Input + MutationInputMap per-mutation envelopes and aggregate map
 *  10. MutationRegistry                 mutationName -> declared `changed` map
 *  11. QueryResponseMap / HandleQueryResponse    aliases over shared helpers
 *  12. MutationResponseMap / HandleMutationResponse aliases over shared helpers
 *  13. ClientSchema                     aggregate map consumed by @tql/client
 *  14. handleQuery / handleMutation     type-only stubs
 */

import type {
  ClientSchema as ClientSchemaConstraint,
  HandleMutationResponseFor,
  HandleQueryResponseFor,
  IncludeNodeMarker,
  MutationResponseMapFor,
  QueryResponseMapFor,
} from '@tql/server/shared';

// ===========================================================================
// ENTITY SHAPES
// ===========================================================================

export interface ProfileEntity {
  id: string;
  name: string;
  hobbies: {
    level: number;
    name: string;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  __model: 'profile';
}

export interface PostEntity {
  id: string;
  title: string;
  content: string;
  profileId: string;
  __model: 'post';
}

export interface CommentEntity {
  id: string;
  comment: string;
  postId: string;
  profileId: string;
  __model: 'comment';
}

// ===========================================================================
// EXTERNAL FIELD VALUE TYPES (not part of Entity / model Zod schema)
// ===========================================================================

export type ProfileExternalFields = Record<never, never>;

export interface PostExternalFields {
  commentsCount: number;
}

export type CommentExternalFields = Record<never, never>;

// ===========================================================================
// ENTITY BY NAME (drives mutation response projection without distributing over a union)
// ===========================================================================

export interface SchemaEntities {
  profile: ProfileEntity;
  post: PostEntity;
  comment: CommentEntity;
}

// ===========================================================================
// PER-MODEL SELECT SHAPES (entity scalars + external field scalars)
// ===========================================================================

type ProfileScalarSelectMap = { [K in Exclude<keyof ProfileEntity, '__model'>]?: true };
type ProfileExternalSelectMap = { [K in keyof ProfileExternalFields]?: true };
type ProfileSelectMap = ProfileScalarSelectMap & ProfileExternalSelectMap;
type ProfileSelect = true | ProfileSelectMap;

type PostScalarSelectMap = { [K in Exclude<keyof PostEntity, '__model'>]?: true };
type PostExternalSelectMap = { [K in keyof PostExternalFields]?: true };
type PostSelectMap = PostScalarSelectMap & PostExternalSelectMap;
type PostSelect = true | PostSelectMap;

type CommentScalarSelectMap = { [K in Exclude<keyof CommentEntity, '__model'>]?: true };
type CommentExternalSelectMap = { [K in keyof CommentExternalFields]?: true };
type CommentSelectMap = CommentScalarSelectMap & CommentExternalSelectMap;
type CommentSelect = true | CommentSelectMap;

// ===========================================================================
// INCLUDE NODES (one named interface per parent x include relation)
// ===========================================================================

interface Profile_Posts_IncludeNode extends IncludeNodeMarker<'many', PostEntity> {
  query: {
    limit: number;
    order: 'asc' | 'desc';
  };
  select: PostSelect;
  include?: PostIncludeMap;
}

interface Profile_Comments_IncludeNode extends IncludeNodeMarker<'many', CommentEntity> {
  query: {
    limit: number;
    order: 'asc' | 'desc';
  };
  select: CommentSelect;
  include?: CommentIncludeMap;
}

interface Post_Profile_IncludeNode extends IncludeNodeMarker<'single', ProfileEntity> {
  query: {
    comment: string | null;
  };
  select: ProfileSelect;
  include?: ProfileIncludeMap;
}

interface Post_FirstComment_IncludeNode extends IncludeNodeMarker<'singleNullable', CommentEntity> {
  query: {
    limit: number;
    order: 'asc' | 'desc';
  };
  select: CommentSelect;
  include?: CommentIncludeMap;
}

interface Post_Comments_IncludeNode extends IncludeNodeMarker<'many', CommentEntity> {
  query: {
    limit: number;
    order: 'asc' | 'desc';
  };
  select: CommentSelect;
  include?: CommentIncludeMap;
}

interface Comment_Profile_IncludeNode extends IncludeNodeMarker<'single', ProfileEntity> {
  select: ProfileSelect;
  include?: ProfileIncludeMap;
}

// ===========================================================================
// PER-MODEL INCLUDE MAPS
// ===========================================================================

interface ProfileIncludeMap {
  posts?: Profile_Posts_IncludeNode;
  comments?: Profile_Comments_IncludeNode;
}

interface PostIncludeMap {
  profile?: Post_Profile_IncludeNode;
  firstComment?: Post_FirstComment_IncludeNode;
  comments?: Post_Comments_IncludeNode;
}

interface CommentIncludeMap {
  profile?: Comment_Profile_IncludeNode;
}

// ===========================================================================
// PER-QUERY INPUT INTERFACES
// ===========================================================================

// ---- profile ----

export interface ProfileByIdInput {
  query: {
    id: string;
  };
  select: ProfileSelect;
  include?: ProfileIncludeMap;
}

export interface ProfileInput {
  query: {
    name: string | null;
  };
  select: ProfileSelect;
  include?: ProfileIncludeMap;
}

export interface ProfileNullableInput {
  query: {};
  select: ProfileSelect;
  include?: ProfileIncludeMap;
}

export interface ProfilesInput {
  query: {
    cursor: {
      id: string;
    } | null;
    limit: number;
    order: 'asc' | 'desc';
  };
  select: ProfileSelect;
  include?: ProfileIncludeMap;
}

// ---- post ----

export interface PostByIdInput {
  query: {
    id: string;
  };
  select: PostSelect;
  include?: PostIncludeMap;
}

export interface PostInput {
  query: {
    id: string;
  };
  select: PostSelect;
  include?: PostIncludeMap;
}

export interface PostsInput {
  query: {
    title: string | null;
    cursor: {
      id: string;
    } | null;
    limit: number;
    order: 'asc' | 'desc';
  };
  select: PostSelect;
  include?: PostIncludeMap;
}

// ---- comment ----

export interface CommentByIdInput {
  query: {
    id: string;
  };
  select: CommentSelect;
  include?: CommentIncludeMap;
}

// ===========================================================================
// AGGREGATE QUERY INPUT MAP
// ===========================================================================

export interface QueryInputMap {
  profileById: ProfileByIdInput;
  profile: ProfileInput;
  profileNullable: ProfileNullableInput;
  profiles: ProfilesInput;
  postById: PostByIdInput;
  post: PostInput;
  posts: PostsInput;
  commentById: CommentByIdInput;
}

// ===========================================================================
// QUERY REGISTRY (entity + arity + nullability + include map + externalFieldKeys + externalFields)
// ===========================================================================

export interface QueryRegistry {
  profileById: { entity: ProfileEntity; kind: 'single'; nullable: false; includeMap: ProfileIncludeMap; externalFieldKeys: readonly []; externalFields: ProfileExternalFields };
  profile: { entity: ProfileEntity; kind: 'single'; nullable: false; includeMap: ProfileIncludeMap; externalFieldKeys: readonly []; externalFields: ProfileExternalFields };
  profileNullable: { entity: ProfileEntity; kind: 'single'; nullable: true; includeMap: ProfileIncludeMap; externalFieldKeys: readonly []; externalFields: ProfileExternalFields };
  profiles: { entity: ProfileEntity; kind: 'many'; nullable: false; includeMap: ProfileIncludeMap; externalFieldKeys: readonly []; externalFields: ProfileExternalFields };
  postById: { entity: PostEntity; kind: 'single'; nullable: false; includeMap: PostIncludeMap; externalFieldKeys: readonly ["commentsCount"]; externalFields: PostExternalFields };
  post: { entity: PostEntity; kind: 'single'; nullable: false; includeMap: PostIncludeMap; externalFieldKeys: readonly ["commentsCount"]; externalFields: PostExternalFields };
  posts: { entity: PostEntity; kind: 'many'; nullable: false; includeMap: PostIncludeMap; externalFieldKeys: readonly ["commentsCount"]; externalFields: PostExternalFields };
  commentById: { entity: CommentEntity; kind: 'single'; nullable: false; includeMap: CommentIncludeMap; externalFieldKeys: readonly []; externalFields: CommentExternalFields };
}

// ===========================================================================
// PER-MUTATION INPUT INTERFACES
// ===========================================================================

interface CreateProfileInputData {
  name: string;
  hobbies: {
    level: number;
    name: string;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
export interface CreateProfileInput {
  input: CreateProfileInputData;
}

interface CreateProfileNoChangesInputData {
  name: string;
  hobbies: {
    level: number;
    name: string;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
export interface CreateProfileNoChangesInput {
  input: CreateProfileNoChangesInputData;
}

interface CreateProfileUnauthorizedInputData {
  name: string;
  hobbies: {
    level: number;
    name: string;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
export interface CreateProfileUnauthorizedInput {
  input: CreateProfileUnauthorizedInputData;
}

interface CreateProfileMalformedResponseInputData {
  name: string;
  hobbies: {
    level: number;
    name: string;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
export interface CreateProfileMalformedResponseInput {
  input: CreateProfileMalformedResponseInputData;
}

interface CreatePostInputData {
  id: string;
  title: string;
  content: string;
  profileId: string;
}
export interface CreatePostInput {
  input: CreatePostInputData;
}

interface CreateCommentInputData {
  id: string;
  comment: string;
  postId: string;
  profileId: string;
}
export interface CreateCommentInput {
  input: CreateCommentInputData;
}

// ===========================================================================
// AGGREGATE MUTATION INPUT MAP
// ===========================================================================

export interface MutationInputMap {
  createProfile: CreateProfileInput;
  createProfileNoChanges: CreateProfileNoChangesInput;
  createProfileUnauthorized: CreateProfileUnauthorizedInput;
  createProfileMalformedResponse: CreateProfileMalformedResponseInput;
  createPost: CreatePostInput;
  createComment: CreateCommentInput;
}

// ===========================================================================
// MUTATION REGISTRY (literal `changed` map per mutation)
// ===========================================================================

export interface MutationRegistry {
  createProfile: { profile: { inserts: true } };
  createProfileNoChanges: {};
  createProfileUnauthorized: { profile: { inserts: true } };
  createProfileMalformedResponse: { profile: { inserts: true } };
  createPost: { post: { inserts: true } };
  createComment: { comment: { inserts: true } };
}

// ===========================================================================
// QUERY PROJECTION + RESPONSE
// ===========================================================================

/**
 * Fixed per-query response map. Each key returns the *full* entity (no select
 * projection) so it can be referenced by the resolver classes without paying
 * the cost of per-call inference.
 */
export type QueryResponseMap = QueryResponseMapFor<QueryRegistry, QueryInputMap>;

export type HandleQueryResponse<Q extends Partial<QueryInputMap>> = HandleQueryResponseFor<QueryRegistry, QueryInputMap, Q>;

// ===========================================================================
// MUTATION PROJECTION + RESPONSE
// ===========================================================================

/**
 * Fixed per-mutation response map. Each key resolves to the full
 * `MutationChangesFromRegistry<MutationRegistry, SchemaEntities, K>` for
 * that mutation. Resolver classes use this for their bulk return type
 * while preserving per-key projection.
 */
export type MutationResponseMap = MutationResponseMapFor<MutationRegistry, SchemaEntities, MutationInputMap>;

export type HandleMutationResponse<Q extends Partial<MutationInputMap>> = HandleMutationResponseFor<
  MutationRegistry,
  SchemaEntities,
  MutationInputMap,
  Q
>;

// ===========================================================================
// CLIENT SCHEMA (single aggregate consumed by @tql/client)
// ===========================================================================

/**
 * Aggregate type consumed by `@tql/client`. The client is parameterized by a
 * single `ClientSchema` so it can index every shape it needs — query inputs,
 * query responses, mutation inputs, mutation responses, entity shapes, and
 * the per-query / per-mutation registries used to project response data from
 * the user's actual `select` / `include` shape — off one generic instead of
 * duck-typing a resolver class.
 *
 * Satisfies the {@link ClientSchemaConstraint} from `@tql/server/shared`.
 */
export interface ClientSchema extends ClientSchemaConstraint {
  QueryInputMap: QueryInputMap;
  QueryResponseMap: QueryResponseMap;
  QueryRegistry: QueryRegistry;
  MutationInputMap: MutationInputMap;
  MutationResponseMap: MutationResponseMap;
  MutationRegistry: MutationRegistry;
  SchemaEntities: SchemaEntities;
}
