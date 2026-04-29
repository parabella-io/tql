// @schema-hash 1127b3d17fce1a87
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

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __model: 'user';
}

export interface WorkspaceEntity {
  id: string;
  name: string;
  __model: 'workspace';
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
  __model: 'workspaceMember';
}

export interface WorkspaceTicketLabelEntity {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'workspaceTicketLabel';
}

export interface WorkspaceMemberInviteEntity {
  id: string;
  email: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'workspaceMemberInvite';
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
  __model: 'ticket';
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
  __model: 'ticketAttachment';
}

export interface TicketCommentEntity {
  id: string;
  content: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketComment';
}

export interface TicketLabelEntity {
  id: string;
  name: string;
  workspaceTicketLabelId: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketLabel';
}

export interface TicketAssigneeEntity {
  id: string;
  ticketId: string;
  userId: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketAssignee';
}

export interface TicketReporterEntity {
  id: string;
  ticketId: string;
  userId: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketReporter';
}

export interface TicketListEntity {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketList';
}

// ===========================================================================
// EXTERNAL FIELD VALUE TYPES (not part of Entity / model Zod schema)
// ===========================================================================

export type UserExternalFields = Record<never, never>;

export type WorkspaceExternalFields = Record<never, never>;

export type WorkspaceMemberExternalFields = Record<never, never>;

export type WorkspaceTicketLabelExternalFields = Record<never, never>;

export type WorkspaceMemberInviteExternalFields = Record<never, never>;

export type TicketExternalFields = Record<never, never>;

export type TicketAttachmentExternalFields = Record<never, never>;

export type TicketCommentExternalFields = Record<never, never>;

export type TicketLabelExternalFields = Record<never, never>;

export type TicketAssigneeExternalFields = Record<never, never>;

export type TicketReporterExternalFields = Record<never, never>;

export type TicketListExternalFields = Record<never, never>;

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
// PER-MODEL SELECT SHAPES (entity scalars + external field scalars)
// ===========================================================================

type UserScalarSelectMap = { [K in Exclude<keyof UserEntity, '__model'>]?: true };
type UserExternalSelectMap = { [K in keyof UserExternalFields]?: true };
type UserSelectMap = UserScalarSelectMap & UserExternalSelectMap;
type UserSelect = true | UserSelectMap;

type WorkspaceScalarSelectMap = { [K in Exclude<keyof WorkspaceEntity, '__model'>]?: true };
type WorkspaceExternalSelectMap = { [K in keyof WorkspaceExternalFields]?: true };
type WorkspaceSelectMap = WorkspaceScalarSelectMap & WorkspaceExternalSelectMap;
type WorkspaceSelect = true | WorkspaceSelectMap;

type WorkspaceMemberScalarSelectMap = { [K in Exclude<keyof WorkspaceMemberEntity, '__model'>]?: true };
type WorkspaceMemberExternalSelectMap = { [K in keyof WorkspaceMemberExternalFields]?: true };
type WorkspaceMemberSelectMap = WorkspaceMemberScalarSelectMap & WorkspaceMemberExternalSelectMap;
type WorkspaceMemberSelect = true | WorkspaceMemberSelectMap;

type WorkspaceTicketLabelScalarSelectMap = { [K in Exclude<keyof WorkspaceTicketLabelEntity, '__model'>]?: true };
type WorkspaceTicketLabelExternalSelectMap = { [K in keyof WorkspaceTicketLabelExternalFields]?: true };
type WorkspaceTicketLabelSelectMap = WorkspaceTicketLabelScalarSelectMap & WorkspaceTicketLabelExternalSelectMap;
type WorkspaceTicketLabelSelect = true | WorkspaceTicketLabelSelectMap;

type WorkspaceMemberInviteScalarSelectMap = { [K in Exclude<keyof WorkspaceMemberInviteEntity, '__model'>]?: true };
type WorkspaceMemberInviteExternalSelectMap = { [K in keyof WorkspaceMemberInviteExternalFields]?: true };
type WorkspaceMemberInviteSelectMap = WorkspaceMemberInviteScalarSelectMap & WorkspaceMemberInviteExternalSelectMap;
type WorkspaceMemberInviteSelect = true | WorkspaceMemberInviteSelectMap;

type TicketScalarSelectMap = { [K in Exclude<keyof TicketEntity, '__model'>]?: true };
type TicketExternalSelectMap = { [K in keyof TicketExternalFields]?: true };
type TicketSelectMap = TicketScalarSelectMap & TicketExternalSelectMap;
type TicketSelect = true | TicketSelectMap;

type TicketAttachmentScalarSelectMap = { [K in Exclude<keyof TicketAttachmentEntity, '__model'>]?: true };
type TicketAttachmentExternalSelectMap = { [K in keyof TicketAttachmentExternalFields]?: true };
type TicketAttachmentSelectMap = TicketAttachmentScalarSelectMap & TicketAttachmentExternalSelectMap;
type TicketAttachmentSelect = true | TicketAttachmentSelectMap;

type TicketCommentScalarSelectMap = { [K in Exclude<keyof TicketCommentEntity, '__model'>]?: true };
type TicketCommentExternalSelectMap = { [K in keyof TicketCommentExternalFields]?: true };
type TicketCommentSelectMap = TicketCommentScalarSelectMap & TicketCommentExternalSelectMap;
type TicketCommentSelect = true | TicketCommentSelectMap;

type TicketLabelScalarSelectMap = { [K in Exclude<keyof TicketLabelEntity, '__model'>]?: true };
type TicketLabelExternalSelectMap = { [K in keyof TicketLabelExternalFields]?: true };
type TicketLabelSelectMap = TicketLabelScalarSelectMap & TicketLabelExternalSelectMap;
type TicketLabelSelect = true | TicketLabelSelectMap;

type TicketAssigneeScalarSelectMap = { [K in Exclude<keyof TicketAssigneeEntity, '__model'>]?: true };
type TicketAssigneeExternalSelectMap = { [K in keyof TicketAssigneeExternalFields]?: true };
type TicketAssigneeSelectMap = TicketAssigneeScalarSelectMap & TicketAssigneeExternalSelectMap;
type TicketAssigneeSelect = true | TicketAssigneeSelectMap;

type TicketReporterScalarSelectMap = { [K in Exclude<keyof TicketReporterEntity, '__model'>]?: true };
type TicketReporterExternalSelectMap = { [K in keyof TicketReporterExternalFields]?: true };
type TicketReporterSelectMap = TicketReporterScalarSelectMap & TicketReporterExternalSelectMap;
type TicketReporterSelect = true | TicketReporterSelectMap;

type TicketListScalarSelectMap = { [K in Exclude<keyof TicketListEntity, '__model'>]?: true };
type TicketListExternalSelectMap = { [K in keyof TicketListExternalFields]?: true };
type TicketListSelectMap = TicketListScalarSelectMap & TicketListExternalSelectMap;
type TicketListSelect = true | TicketListSelectMap;

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
// QUERY REGISTRY (entity + arity + nullability + include map + externalFieldKeys + externalFields)
// ===========================================================================

export interface QueryRegistry {
  userById: { entity: UserEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: UserExternalFields };
  workspaceById: { entity: WorkspaceEntity; kind: 'single'; nullable: false; includeMap: WorkspaceIncludeMap; externalFieldKeys: readonly []; externalFields: WorkspaceExternalFields };
  myWorkspaces: { entity: WorkspaceEntity; kind: 'many'; nullable: false; includeMap: WorkspaceIncludeMap; externalFieldKeys: readonly []; externalFields: WorkspaceExternalFields };
  workspaceMemberById: { entity: WorkspaceMemberEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: WorkspaceMemberExternalFields };
  workspaceMembers: { entity: WorkspaceMemberEntity; kind: 'many'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: WorkspaceMemberExternalFields };
  workspaceTicketLabelById: { entity: WorkspaceTicketLabelEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: WorkspaceTicketLabelExternalFields };
  workspaceTicketLabels: { entity: WorkspaceTicketLabelEntity; kind: 'many'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: WorkspaceTicketLabelExternalFields };
  workspaceMemberInviteById: { entity: WorkspaceMemberInviteEntity; kind: 'single'; nullable: false; includeMap: WorkspaceMemberInviteIncludeMap; externalFieldKeys: readonly []; externalFields: WorkspaceMemberInviteExternalFields };
  myWorkspaceInvites: { entity: WorkspaceMemberInviteEntity; kind: 'many'; nullable: false; includeMap: WorkspaceMemberInviteIncludeMap; externalFieldKeys: readonly []; externalFields: WorkspaceMemberInviteExternalFields };
  workspaceMemberInvites: { entity: WorkspaceMemberInviteEntity; kind: 'many'; nullable: false; includeMap: WorkspaceMemberInviteIncludeMap; externalFieldKeys: readonly []; externalFields: WorkspaceMemberInviteExternalFields };
  ticketById: { entity: TicketEntity; kind: 'single'; nullable: false; includeMap: TicketIncludeMap; externalFieldKeys: readonly []; externalFields: TicketExternalFields };
  tickets: { entity: TicketEntity; kind: 'many'; nullable: false; includeMap: TicketIncludeMap; externalFieldKeys: readonly []; externalFields: TicketExternalFields };
  ticketAttachmentById: { entity: TicketAttachmentEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketAttachmentExternalFields };
  ticketAttachments: { entity: TicketAttachmentEntity; kind: 'many'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketAttachmentExternalFields };
  ticketCommentById: { entity: TicketCommentEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketCommentExternalFields };
  ticketComments: { entity: TicketCommentEntity; kind: 'many'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketCommentExternalFields };
  ticketLabelById: { entity: TicketLabelEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketLabelExternalFields };
  ticketLabels: { entity: TicketLabelEntity; kind: 'many'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketLabelExternalFields };
  ticketAssigneeById: { entity: TicketAssigneeEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketAssigneeExternalFields };
  ticketReporterById: { entity: TicketReporterEntity; kind: 'single'; nullable: false; includeMap: never; externalFieldKeys: readonly []; externalFields: TicketReporterExternalFields };
  ticketListById: { entity: TicketListEntity; kind: 'single'; nullable: false; includeMap: TicketListIncludeMap; externalFieldKeys: readonly []; externalFields: TicketListExternalFields };
  ticketLists: { entity: TicketListEntity; kind: 'many'; nullable: false; includeMap: TicketListIncludeMap; externalFieldKeys: readonly []; externalFields: TicketListExternalFields };
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
