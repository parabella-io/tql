/**
 * Codegen example output for MUTATIONS — DO NOT EDIT.
 *
 * Hand-written prototype of what a TQL mutation-schema generator would emit
 * for the apps/api/src/mutations registry. Mirrors the runtime behaviour of
 * MutationResolver.handle (../mutation/mutation-resolver.ts) but as named,
 * non-recursive interfaces so TypeScript resolves each mutation in near-O(1)
 * instead of walking the deep `FlattenedMutationsInput` / `MutationChangesFor`
 * generic chain.
 *
 * Layout:
 *   1. Core helpers                     `WithId<T>`, `MutationOp`
 *   2. Entity interfaces                redeclared standalone (no imports from
 *                                       ./example.ts) so this file is self-
 *                                       contained — exactly what a per-domain
 *                                       generator would emit
 *   3. <Mutation>InputData / Input      one pair per mutation, with the
 *                                       `{ input: ... }` envelope that
 *                                       MutationResolver.handle parses
 *   4. MutationInputMap                 flat `mutationName -> input` aggregate
 *   5. MutationRegistry                 flat `mutationName -> changed` aggregate
 *   6. MutationChanges / response       shallow helpers + mapped response type
 *   7. handleMutation                   type-only stub
 */

import type { FormattedTQLServerError } from '../errors.js';

// =============================================================================
// CORE HELPERS
// =============================================================================

type WithId<T> = { id: string } & Omit<T, 'id'>;

type MutationOp = 'inserts' | 'updates' | 'upserts' | 'deletes';

// =============================================================================
// ENTITY SHAPES (redeclared standalone; mirrors apps/api/src/schema.ts)
// =============================================================================

interface UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __model: 'user';
}

interface WorkspaceEntity {
  id: string;
  name: string;
  __model: 'workspace';
}

interface WorkspaceMemberEntity {
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

interface WorkspaceMemberInviteEntity {
  id: string;
  email: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'workspaceMemberInvite';
}

interface WorkspaceTicketLabelEntity {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'workspaceTicketLabel';
}

interface TicketEntity {
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

interface TicketListEntity {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketList';
}

interface TicketAssigneeEntity {
  id: string;
  ticketId: string;
  userId: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketAssignee';
}

interface TicketReporterEntity {
  id: string;
  ticketId: string;
  userId: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketReporter';
}

interface TicketAttachmentEntity {
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

interface TicketCommentEntity {
  id: string;
  content: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketComment';
}

interface TicketLabelEntity {
  id: string;
  name: string;
  workspaceTicketLabelId: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  __model: 'ticketLabel';
}

// String-literal -> entity lookup. Drives the response projection without
// distributing over a union of entities.
interface EntityByName {
  user: UserEntity;
  workspace: WorkspaceEntity;
  workspaceMember: WorkspaceMemberEntity;
  workspaceMemberInvite: WorkspaceMemberInviteEntity;
  workspaceTicketLabel: WorkspaceTicketLabelEntity;
  ticket: TicketEntity;
  ticketList: TicketListEntity;
  ticketAssignee: TicketAssigneeEntity;
  ticketReporter: TicketReporterEntity;
  ticketAttachment: TicketAttachmentEntity;
  ticketComment: TicketCommentEntity;
  ticketLabel: TicketLabelEntity;
}

// =============================================================================
// PER-MUTATION INPUT INTERFACES
//
// Each mutation gets a concrete <Mutation>InputData (the parsed z.object shape)
// and a <Mutation>Input wrapper carrying the `{ input: ... }` envelope that
// MutationResolver.handle reads.
// =============================================================================

// ---- user ----
interface UpdateUserInputData {
  userId: string;
  name: string;
}
export interface UpdateUserInput {
  input: UpdateUserInputData;
}

// ---- workspace ----
interface CreateWorkspaceInputData {
  name: string;
}
export interface CreateWorkspaceInput {
  input: CreateWorkspaceInputData;
}

interface UpdateWorkspaceInputData {
  workspaceId: string;
  name: string;
}
export interface UpdateWorkspaceInput {
  input: UpdateWorkspaceInputData;
}

interface DeleteWorkspaceInputData {
  id: string;
}
export interface DeleteWorkspaceInput {
  input: DeleteWorkspaceInputData;
}

// ---- workspace member invites ----
interface InviteWorkspaceMemberInputData {
  workspaceId: string;
  email: string;
}
export interface InviteWorkspaceMemberInput {
  input: InviteWorkspaceMemberInputData;
}

interface RemoveInviteWorkspaceMemberInputData {
  workspaceId: string;
  inviteId: string;
}
export interface RemoveInviteWorkspaceMemberInput {
  input: RemoveInviteWorkspaceMemberInputData;
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

// ---- workspace members ----
interface RemoveWorkspaceMemberInputData {
  workspaceId: string;
  memberId: string;
}
export interface RemoveWorkspaceMemberInput {
  input: RemoveWorkspaceMemberInputData;
}

// ---- workspace ticket labels ----
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

// ---- ticket lists ----
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

// ---- tickets ----
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

// ---- ticket attachments ----
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

// ---- ticket assignees ----
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

// ---- ticket labels ----
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

// =============================================================================
// AGGREGATE INPUT MAP
// =============================================================================

export interface MutationInputMap {
  updateUser: UpdateUserInput;
  createWorkspace: CreateWorkspaceInput;
  updateWorkspace: UpdateWorkspaceInput;
  deleteWorkspace: DeleteWorkspaceInput;
  inviteWorkspaceMember: InviteWorkspaceMemberInput;
  removeInviteWorkspaceMember: RemoveInviteWorkspaceMemberInput;
  acceptWorkspaceMemberInvite: AcceptWorkspaceMemberInviteInput;
  declineWorkspaceMemberInvite: DeclineWorkspaceMemberInviteInput;
  removeWorkspaceMember: RemoveWorkspaceMemberInput;
  createWorkspaceTicketLabel: CreateWorkspaceTicketLabelInput;
  deleteWorkspaceTicketLabel: DeleteWorkspaceTicketLabelInput;
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
}

// =============================================================================
// MUTATION REGISTRY (literal `changed` map per mutation)
//
// Drives response projection in HandleMutationResponse without per-mutation
// changes-type aliases. `acceptWorkspaceMemberInvite` is the only entry that
// declares more than one model; everything else is a single-model change.
// =============================================================================

interface MutationRegistry {
  updateUser: { user: { updates: true } };

  createWorkspace: { workspace: { inserts: true } };
  updateWorkspace: { workspace: { updates: true } };
  deleteWorkspace: { workspace: { deletes: true } };

  inviteWorkspaceMember: { workspaceMemberInvite: { inserts: true } };
  removeInviteWorkspaceMember: { workspaceMemberInvite: { deletes: true } };
  declineWorkspaceMemberInvite: { workspaceMemberInvite: { deletes: true } };

  acceptWorkspaceMemberInvite: {
    workspace: { inserts: true };
    workspaceMember: { inserts: true };
    workspaceMemberInvite: { deletes: true };
  };

  removeWorkspaceMember: { workspaceMember: { deletes: true } };

  createWorkspaceTicketLabel: { workspaceTicketLabel: { inserts: true } };
  deleteWorkspaceTicketLabel: { workspaceTicketLabel: { deletes: true } };

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
}

// =============================================================================
// PROJECTION + RESPONSE
//
// MutationChanges resolves a single registry entry into the
// `{ [model]: { [op]?: WithId<Entity>[] } }` shape returned by
// MutationResolver.handle. Per-call work is bounded by the model count of the
// entry the caller invoked (1 for ~all mutations, 3 for
// acceptWorkspaceMemberInvite), regardless of how many mutations exist.
// =============================================================================

type MutationChanges<K extends keyof MutationRegistry> = {
  [Model in keyof MutationRegistry[K] & keyof EntityByName]: {
    [Op in keyof MutationRegistry[K][Model] & MutationOp as MutationRegistry[K][Model][Op] extends true ? Op : never]?: WithId<
      EntityByName[Model]
    >[];
  };
};

export type HandleMutationResponse<Q extends Partial<MutationInputMap>> = {
  [K in keyof Q & keyof MutationRegistry]: {
    changes: MutationChanges<K>;
    error: FormattedTQLServerError | null;
  };
};

// =============================================================================
// handleMutation — type-only stub
//
// Real execution still flows through MutationResolver.handle in
// ../mutation/mutation-resolver.ts. This entry point exists purely to
// demonstrate that the static schema above resolves the `changes` shape
// cheaply without touching the FlattenedMutationsInput / MutationChangesFor
// generic chain.
// =============================================================================

export function handleMutation<const Q extends Partial<MutationInputMap>>(mutation: Q): HandleMutationResponse<Q> {
  void mutation;
  return null as unknown as HandleMutationResponse<Q>;
}
