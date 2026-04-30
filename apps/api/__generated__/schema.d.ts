// @schema-hash 676b81b1936fc053
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
 *   1. <Model>Entity                    one per registered model
 *   2. SchemaEntities                   name -> entity lookup (mutation projection)
 *   3. <Model>Select / <Model>SelectMap entity scalars
 *   4. <Parent>_<Include>_IncludeNode   one named interface per (parent, include) pair
 *   5. <Model>IncludeMap                map of relation-name -> named IncludeNode
 *   6. <Query>Input + QueryInputMap     per-query envelopes (`query`, `select`, `include?`) and aggregate map
 *   7. QueryRegistry                    queryName -> { entity, kind, nullable, includeMap, externalFieldKeys }
 *   8. <Mutation>Input + MutationInputMap per-mutation envelopes and aggregate map
 *   9. MutationRegistry                 mutationName -> declared `changed` map
 *  10. QueryResponseMap / HandleQueryResponse    aliases over shared helpers
 *  11. MutationResponseMap / HandleMutationResponse aliases over shared helpers
 *  12. ClientSchema                     aggregate map consumed by @tql/client
 *  13. handleQuery / handleMutation     type-only stubs
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

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceEntity {
  id: string;
  name: string;
}

export interface WorkspaceMemberEntity {
  id: string;
  userId: string;
  name: string;
  email: string;
  workspaceId: string;
  isWorkspaceOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceTicketLabelEntity {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberInviteEntity {
  id: string;
  email: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketEntity {
  id: string;
  title: string;
  description: string;
  workspaceId: string;
  ticketListId: string;
  assigneeId: string | null;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketAttachmentEntity {
  id: string;
  ticketId: string;
  key: string;
  name: string;
  size: number;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketCommentEntity {
  id: string;
  content: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketLabelEntity {
  id: string;
  name: string;
  workspaceTicketLabelId: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketAssigneeEntity {
  id: string;
  ticketId: string;
  userId: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketReporterEntity {
  id: string;
  ticketId: string;
  userId: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketListEntity {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================================================
// ENTITY BY NAME (drives mutation response projection without distributing over a union)
// ===========================================================================

export interface SchemaEntities {
  user: UserEntity;
  workspace: WorkspaceEntity;
  workspaceMember: WorkspaceMemberEntity;
  workspaceTicketLabel: WorkspaceTicketLabelEntity;
  workspaceMemberInvite: WorkspaceMemberInviteEntity;
  ticket: TicketEntity;
  ticketAttachment: TicketAttachmentEntity;
  ticketComment: TicketCommentEntity;
  ticketLabel: TicketLabelEntity;
  ticketAssignee: TicketAssigneeEntity;
  ticketReporter: TicketReporterEntity;
  ticketList: TicketListEntity;
}

// ===========================================================================
// PER-MODEL SELECT SHAPES
// ===========================================================================

type UserSelectMap = { [K in keyof UserEntity]?: true };
type UserSelect = UserSelectMap;

type WorkspaceSelectMap = { [K in keyof WorkspaceEntity]?: true };
type WorkspaceSelect = WorkspaceSelectMap;

type WorkspaceMemberSelectMap = { [K in keyof WorkspaceMemberEntity]?: true };
type WorkspaceMemberSelect = WorkspaceMemberSelectMap;

type WorkspaceTicketLabelSelectMap = { [K in keyof WorkspaceTicketLabelEntity]?: true };
type WorkspaceTicketLabelSelect = WorkspaceTicketLabelSelectMap;

type WorkspaceMemberInviteSelectMap = { [K in keyof WorkspaceMemberInviteEntity]?: true };
type WorkspaceMemberInviteSelect = WorkspaceMemberInviteSelectMap;

type TicketSelectMap = { [K in keyof TicketEntity]?: true };
type TicketSelect = TicketSelectMap;

type TicketAttachmentSelectMap = { [K in keyof TicketAttachmentEntity]?: true };
type TicketAttachmentSelect = TicketAttachmentSelectMap;

type TicketCommentSelectMap = { [K in keyof TicketCommentEntity]?: true };
type TicketCommentSelect = TicketCommentSelectMap;

type TicketLabelSelectMap = { [K in keyof TicketLabelEntity]?: true };
type TicketLabelSelect = TicketLabelSelectMap;

type TicketAssigneeSelectMap = { [K in keyof TicketAssigneeEntity]?: true };
type TicketAssigneeSelect = TicketAssigneeSelectMap;

type TicketReporterSelectMap = { [K in keyof TicketReporterEntity]?: true };
type TicketReporterSelect = TicketReporterSelectMap;

type TicketListSelectMap = { [K in keyof TicketListEntity]?: true };
type TicketListSelect = TicketListSelectMap;

// ===========================================================================
// INCLUDE NODES (one named interface per parent x include relation)
// ===========================================================================

interface Workspace_Owner_IncludeNode extends IncludeNodeMarker<'single', WorkspaceMemberEntity> {
  select: WorkspaceMemberSelect;
}

interface WorkspaceMemberInvite_Workspace_IncludeNode extends IncludeNodeMarker<'single', WorkspaceEntity> {
  select: WorkspaceSelect;
  include?: WorkspaceIncludeMap;
}

interface Ticket_Assignee_IncludeNode extends IncludeNodeMarker<'singleNullable', TicketAssigneeEntity> {
  select: TicketAssigneeSelect;
}

interface Ticket_Reporter_IncludeNode extends IncludeNodeMarker<'single', TicketReporterEntity> {
  select: TicketReporterSelect;
}

interface Ticket_Attachments_IncludeNode extends IncludeNodeMarker<'many', TicketAttachmentEntity> {
  query: {
    order: 'asc' | 'desc';
  };
  select: TicketAttachmentSelect;
}

interface Ticket_Comments_IncludeNode extends IncludeNodeMarker<'many', TicketCommentEntity> {
  query: {
    order: 'asc' | 'desc';
  };
  select: TicketCommentSelect;
}

interface Ticket_Labels_IncludeNode extends IncludeNodeMarker<'many', TicketLabelEntity> {
  query: {
    order: 'asc' | 'desc';
  };
  select: TicketLabelSelect;
}

interface TicketList_Tickets_IncludeNode extends IncludeNodeMarker<'many', TicketEntity> {
  query: {
    limit: number;
    order: 'asc' | 'desc';
  };
  select: TicketSelect;
  include?: TicketIncludeMap;
}

// ===========================================================================
// PER-MODEL INCLUDE MAPS
// ===========================================================================

interface WorkspaceIncludeMap {
  owner?: Workspace_Owner_IncludeNode;
}

interface WorkspaceMemberInviteIncludeMap {
  workspace?: WorkspaceMemberInvite_Workspace_IncludeNode;
}

interface TicketIncludeMap {
  assignee?: Ticket_Assignee_IncludeNode;
  reporter?: Ticket_Reporter_IncludeNode;
  attachments?: Ticket_Attachments_IncludeNode;
  comments?: Ticket_Comments_IncludeNode;
  labels?: Ticket_Labels_IncludeNode;
}

interface TicketListIncludeMap {
  tickets?: TicketList_Tickets_IncludeNode;
}

// ===========================================================================
// PER-QUERY INPUT INTERFACES
// ===========================================================================

// ---- user ----

export interface UserByIdInput {
  query: {
    id: string;
  };
  select: UserSelect;
}

// ---- workspace ----

export interface WorkspaceByIdInput {
  query: {
    id: string;
  };
  select: WorkspaceSelect;
  include?: WorkspaceIncludeMap;
}

export interface MyWorkspacesInput {
  query: {};
  select: WorkspaceSelect;
  include?: WorkspaceIncludeMap;
}

// ---- workspaceMember ----

export interface WorkspaceMemberByIdInput {
  query: {
    id: string;
  };
  select: WorkspaceMemberSelect;
}

export interface WorkspaceMembersInput {
  query: {
    workspaceId: string;
  };
  select: WorkspaceMemberSelect;
  pagingInfo: {
    take?: number;
    before?: string | null;
    after?: string | null;
  };
}

// ---- workspaceTicketLabel ----

export interface WorkspaceTicketLabelByIdInput {
  query: {
    id: string;
  };
  select: WorkspaceTicketLabelSelect;
}

export interface WorkspaceTicketLabelsInput {
  query: {
    workspaceId: string;
  };
  select: WorkspaceTicketLabelSelect;
}

// ---- workspaceMemberInvite ----

export interface WorkspaceMemberInviteByIdInput {
  query: {
    id: string;
  };
  select: WorkspaceMemberInviteSelect;
  include?: WorkspaceMemberInviteIncludeMap;
}

export interface MyWorkspaceInvitesInput {
  query: {};
  select: WorkspaceMemberInviteSelect;
  include?: WorkspaceMemberInviteIncludeMap;
}

export interface WorkspaceMemberInvitesInput {
  query: {
    workspaceId: string;
  };
  select: WorkspaceMemberInviteSelect;
  include?: WorkspaceMemberInviteIncludeMap;
  pagingInfo: {
    take?: number;
    before?: string | null;
    after?: string | null;
  };
}

// ---- ticket ----

export interface TicketByIdInput {
  query: {
    id: string;
  };
  select: TicketSelect;
  include?: TicketIncludeMap;
}

export interface TicketsInput {
  query: {
    workspaceId: string;
    limit: number;
    order: 'asc' | 'desc';
  };
  select: TicketSelect;
  include?: TicketIncludeMap;
}

// ---- ticketAttachment ----

export interface TicketAttachmentByIdInput {
  query: {
    id: string;
  };
  select: TicketAttachmentSelect;
}

export interface TicketAttachmentsInput {
  query: {
    ticketId: string;
    order: 'asc' | 'desc';
  };
  select: TicketAttachmentSelect;
}

// ---- ticketComment ----

export interface TicketCommentByIdInput {
  query: {
    id: string;
  };
  select: TicketCommentSelect;
}

export interface TicketCommentsInput {
  query: {
    ticketId: string;
    order: 'asc' | 'desc';
  };
  select: TicketCommentSelect;
}

// ---- ticketLabel ----

export interface TicketLabelByIdInput {
  query: {
    id: string;
  };
  select: TicketLabelSelect;
}

export interface TicketLabelsInput {
  query: {
    ticketId: string;
    order: 'asc' | 'desc';
  };
  select: TicketLabelSelect;
}

// ---- ticketAssignee ----

export interface TicketAssigneeByIdInput {
  query: {
    id: string;
  };
  select: TicketAssigneeSelect;
}

// ---- ticketReporter ----

export interface TicketReporterByIdInput {
  query: {
    id: string;
  };
  select: TicketReporterSelect;
}

// ---- ticketList ----

export interface TicketListByIdInput {
  query: {
    id: string;
  };
  select: TicketListSelect;
  include?: TicketListIncludeMap;
}

export interface TicketListsInput {
  query: {
    workspaceId: string;
    limit: number;
    order: 'asc' | 'desc';
  };
  select: TicketListSelect;
  include?: TicketListIncludeMap;
}

// ===========================================================================
// AGGREGATE QUERY INPUT MAP
// ===========================================================================

export interface QueryInputMap {
  userById: UserByIdInput;
  workspaceById: WorkspaceByIdInput;
  myWorkspaces: MyWorkspacesInput;
  workspaceMemberById: WorkspaceMemberByIdInput;
  workspaceMembers: WorkspaceMembersInput;
  workspaceTicketLabelById: WorkspaceTicketLabelByIdInput;
  workspaceTicketLabels: WorkspaceTicketLabelsInput;
  workspaceMemberInviteById: WorkspaceMemberInviteByIdInput;
  myWorkspaceInvites: MyWorkspaceInvitesInput;
  workspaceMemberInvites: WorkspaceMemberInvitesInput;
  ticketById: TicketByIdInput;
  tickets: TicketsInput;
  ticketAttachmentById: TicketAttachmentByIdInput;
  ticketAttachments: TicketAttachmentsInput;
  ticketCommentById: TicketCommentByIdInput;
  ticketComments: TicketCommentsInput;
  ticketLabelById: TicketLabelByIdInput;
  ticketLabels: TicketLabelsInput;
  ticketAssigneeById: TicketAssigneeByIdInput;
  ticketReporterById: TicketReporterByIdInput;
  ticketListById: TicketListByIdInput;
  ticketLists: TicketListsInput;
}

// ===========================================================================
// QUERY REGISTRY (entity + arity + nullability + paginated + include map + externalFieldKeys)
// ===========================================================================

export interface QueryRegistry {
  userById: { entity: UserEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  workspaceById: { entity: WorkspaceEntity; kind: 'single'; nullable: false; includeMap: WorkspaceIncludeMap; externalFieldKeys: readonly [] };
  myWorkspaces: { entity: WorkspaceEntity; kind: 'many'; nullable: false; paginated: false; includeMap: WorkspaceIncludeMap; externalFieldKeys: readonly [] };
  workspaceMemberById: { entity: WorkspaceMemberEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  workspaceMembers: { entity: WorkspaceMemberEntity; kind: 'many'; nullable: false; paginated: true; includeMap: never; externalFieldKeys: readonly [] };
  workspaceTicketLabelById: { entity: WorkspaceTicketLabelEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  workspaceTicketLabels: { entity: WorkspaceTicketLabelEntity; kind: 'many'; nullable: false; paginated: false; includeMap: never; externalFieldKeys: readonly [] };
  workspaceMemberInviteById: { entity: WorkspaceMemberInviteEntity; kind: 'single'; nullable: false; includeMap: WorkspaceMemberInviteIncludeMap; externalFieldKeys: readonly [] };
  myWorkspaceInvites: { entity: WorkspaceMemberInviteEntity; kind: 'many'; nullable: false; paginated: false; includeMap: WorkspaceMemberInviteIncludeMap; externalFieldKeys: readonly [] };
  workspaceMemberInvites: { entity: WorkspaceMemberInviteEntity; kind: 'many'; nullable: false; paginated: true; includeMap: WorkspaceMemberInviteIncludeMap; externalFieldKeys: readonly [] };
  ticketById: { entity: TicketEntity; kind: 'single'; nullable: false; includeMap: TicketIncludeMap; externalFieldKeys: readonly [] };
  tickets: { entity: TicketEntity; kind: 'many'; nullable: false; paginated: false; includeMap: TicketIncludeMap; externalFieldKeys: readonly [] };
  ticketAttachmentById: { entity: TicketAttachmentEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketAttachments: { entity: TicketAttachmentEntity; kind: 'many'; nullable: false; paginated: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketCommentById: { entity: TicketCommentEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketComments: { entity: TicketCommentEntity; kind: 'many'; nullable: false; paginated: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketLabelById: { entity: TicketLabelEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketLabels: { entity: TicketLabelEntity; kind: 'many'; nullable: false; paginated: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketAssigneeById: { entity: TicketAssigneeEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketReporterById: { entity: TicketReporterEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly [] };
  ticketListById: { entity: TicketListEntity; kind: 'single'; nullable: false; includeMap: TicketListIncludeMap; externalFieldKeys: readonly [] };
  ticketLists: { entity: TicketListEntity; kind: 'many'; nullable: false; paginated: false; includeMap: TicketListIncludeMap; externalFieldKeys: readonly [] };
}

// ===========================================================================
// PER-MUTATION INPUT INTERFACES
// ===========================================================================

interface CreateTicketListInputData {
  workspaceId: string;
  name: string;
}
export interface CreateTicketListInput {
  input: CreateTicketListInputData;
}

interface UpdateTicketListInputData {
  id: string;
  name: string;
}
export interface UpdateTicketListInput {
  input: UpdateTicketListInputData;
}

interface DeleteTicketListInputData {
  id: string;
}
export interface DeleteTicketListInput {
  input: DeleteTicketListInputData;
}

interface CreateTicketInputData {
  workspaceId: string;
  ticketListId: string;
  title: string;
}
export interface CreateTicketInput {
  input: CreateTicketInputData;
}

interface UpdateTicketInputData {
  id: string;
  description: string;
  title: string;
}
export interface UpdateTicketInput {
  input: UpdateTicketInputData;
}

interface MoveTicketInputData {
  id: string;
  oldTicketListId: string;
  newTicketListId: string;
}
export interface MoveTicketInput {
  input: MoveTicketInputData;
}

interface CreateTicketAttachmentInputData {
  workspaceId: string;
  ticketId: string;
  name: string;
  size: number;
  key: string;
}
export interface CreateTicketAttachmentInput {
  input: CreateTicketAttachmentInputData;
}

interface DeleteTicketAttachmentInputData {
  workspaceId: string;
  ticketId: string;
  attachmentId: string;
}
export interface DeleteTicketAttachmentInput {
  input: DeleteTicketAttachmentInputData;
}

interface AssignTicketMemberInputData {
  workspaceId: string;
  ticketId: string;
  memberId: string;
}
export interface AssignTicketMemberInput {
  input: AssignTicketMemberInputData;
}

interface UnassignTicketMemberInputData {
  workspaceId: string;
  ticketId: string;
}
export interface UnassignTicketMemberInput {
  input: UnassignTicketMemberInputData;
}

interface AddTicketLabelInputData {
  workspaceId: string;
  ticketId: string;
  labelId: string;
}
export interface AddTicketLabelInput {
  input: AddTicketLabelInputData;
}

interface RemoveTicketLabelInputData {
  id: string;
  workspaceId: string;
  ticketId: string;
}
export interface RemoveTicketLabelInput {
  input: RemoveTicketLabelInputData;
}

interface UpdateUserInputData {
  userId: string;
  name: string;
}
export interface UpdateUserInput {
  input: UpdateUserInputData;
}

interface CreateWorkspaceTicketLabelInputData {
  workspaceId: string;
  name: string;
}
export interface CreateWorkspaceTicketLabelInput {
  input: CreateWorkspaceTicketLabelInputData;
}

interface DeleteWorkspaceTicketLabelInputData {
  workspaceId: string;
  id: string;
}
export interface DeleteWorkspaceTicketLabelInput {
  input: DeleteWorkspaceTicketLabelInputData;
}

interface CreateWorkspaceInputData {
  name: string;
}
export interface CreateWorkspaceInput {
  input: CreateWorkspaceInputData;
}

interface DeleteWorkspaceInputData {
  id: string;
}
export interface DeleteWorkspaceInput {
  input: DeleteWorkspaceInputData;
}

interface InviteWorkspaceMemberInputData {
  workspaceId: string;
  email: string;
}
export interface InviteWorkspaceMemberInput {
  input: InviteWorkspaceMemberInputData;
}

interface AcceptWorkspaceMemberInviteInputData {
  workspaceId: string;
  inviteId: string;
}
export interface AcceptWorkspaceMemberInviteInput {
  input: AcceptWorkspaceMemberInviteInputData;
}

interface DeclineWorkspaceMemberInviteInputData {
  workspaceId: string;
  inviteId: string;
}
export interface DeclineWorkspaceMemberInviteInput {
  input: DeclineWorkspaceMemberInviteInputData;
}

interface RemoveInviteWorkspaceMemberInputData {
  workspaceId: string;
  inviteId: string;
}
export interface RemoveInviteWorkspaceMemberInput {
  input: RemoveInviteWorkspaceMemberInputData;
}

interface RemoveWorkspaceMemberInputData {
  workspaceId: string;
  memberId: string;
}
export interface RemoveWorkspaceMemberInput {
  input: RemoveWorkspaceMemberInputData;
}

interface UpdateWorkspaceInputData {
  workspaceId: string;
  name: string;
}
export interface UpdateWorkspaceInput {
  input: UpdateWorkspaceInputData;
}

// ===========================================================================
// AGGREGATE MUTATION INPUT MAP
// ===========================================================================

export interface MutationInputMap {
  createTicketList: CreateTicketListInput;
  updateTicketList: UpdateTicketListInput;
  deleteTicketList: DeleteTicketListInput;
  createTicket: CreateTicketInput;
  updateTicket: UpdateTicketInput;
  moveTicket: MoveTicketInput;
  createTicketAttachment: CreateTicketAttachmentInput;
  deleteTicketAttachment: DeleteTicketAttachmentInput;
  assignTicketMember: AssignTicketMemberInput;
  unassignTicketMember: UnassignTicketMemberInput;
  addTicketLabel: AddTicketLabelInput;
  removeTicketLabel: RemoveTicketLabelInput;
  updateUser: UpdateUserInput;
  createWorkspaceTicketLabel: CreateWorkspaceTicketLabelInput;
  deleteWorkspaceTicketLabel: DeleteWorkspaceTicketLabelInput;
  createWorkspace: CreateWorkspaceInput;
  deleteWorkspace: DeleteWorkspaceInput;
  inviteWorkspaceMember: InviteWorkspaceMemberInput;
  acceptWorkspaceMemberInvite: AcceptWorkspaceMemberInviteInput;
  declineWorkspaceMemberInvite: DeclineWorkspaceMemberInviteInput;
  removeInviteWorkspaceMember: RemoveInviteWorkspaceMemberInput;
  removeWorkspaceMember: RemoveWorkspaceMemberInput;
  updateWorkspace: UpdateWorkspaceInput;
}

// ===========================================================================
// MUTATION REGISTRY (literal `changed` map per mutation)
// ===========================================================================

export interface MutationRegistry {
  createTicketList: { ticketList: { inserts: true } };
  updateTicketList: { ticketList: { updates: true } };
  deleteTicketList: { ticketList: { deletes: true } };
  createTicket: { ticket: { inserts: true } };
  updateTicket: { ticket: { updates: true } };
  moveTicket: { ticket: { updates: true } };
  createTicketAttachment: { ticketAttachment: { inserts: true } };
  deleteTicketAttachment: { ticketAttachment: { deletes: true } };
  assignTicketMember: { ticketAssignee: { inserts: true } };
  unassignTicketMember: { ticketAssignee: { deletes: true } };
  addTicketLabel: { ticketLabel: { inserts: true } };
  removeTicketLabel: { ticketLabel: { deletes: true } };
  updateUser: { user: { updates: true } };
  createWorkspaceTicketLabel: { workspaceTicketLabel: { inserts: true } };
  deleteWorkspaceTicketLabel: { workspaceTicketLabel: { deletes: true } };
  createWorkspace: { workspace: { inserts: true } };
  deleteWorkspace: { workspace: { deletes: true } };
  inviteWorkspaceMember: { workspaceMemberInvite: { inserts: true } };
  acceptWorkspaceMemberInvite: { workspace: { inserts: true }; workspaceMember: { inserts: true }; workspaceMemberInvite: { deletes: true } };
  declineWorkspaceMemberInvite: { workspaceMemberInvite: { deletes: true } };
  removeInviteWorkspaceMember: { workspaceMemberInvite: { deletes: true } };
  removeWorkspaceMember: { workspaceMember: { deletes: true } };
  updateWorkspace: { workspace: { updates: true } };
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
