/**
 * Codegen example output — DO NOT EDIT.
 *
 * Hand-written prototype of what a TQL query-schema generator would emit for
 * the apps/api/src/models registry. Mirrors the runtime behaviour of
 * QueryResolver.handle (../query/query-resolver.ts) but as named, non-recursive
 * interfaces so that TypeScript resolves each query in near-O(1) instead of
 * walking the deep `FlattenedQueriesInput` / `HandleQueryResponse` chain.
 *
 * Layout per model:
 *   1. <Model>Entity                    full entity shape with `__model` brand
 *   2. <Model>SelectMap / <Model>Select selectable scalar projection input
 *   3. <Model>IncludeMap                map of relation-name -> named IncludeNode
 *   4. <Parent>_<Include>_IncludeNode   one named interface per (parent, include) pair
 *
 * Layout per query:
 *   5. <Query>Input                     `{ query, select, include? }` interface
 *
 * Aggregates:
 *   6. QueryInputMap                    flat map of queryName -> input interface
 *   7. QueryRegistry                    queryName -> { entity, kind, nullable, includeMap }
 *
 * Recursion is by **name** rather than by structural conditional types, so each
 * lookup is a single property read rather than a fresh instantiation of a
 * distributed conditional type. The only generic helpers are `Selected`,
 * `IncludeProjection`, and `ResolveIncludeNode`, all shallow and bounded.
 */

import type { FormattedTQLServerError } from '../errors.js';

// =============================================================================
// CORE HELPERS
// =============================================================================

type IncludeKind = 'single' | 'singleNullable' | 'many';

interface IncludeNodeMarker<Kind extends IncludeKind, Target> {
  readonly __kind?: Kind;
  readonly __target?: Target;
}

type ExtractSelect<Node> = Node extends { select: infer S } ? S : true;

type ExtractInclude<Node> = Node extends { include?: infer I } ? I : undefined;

type GetNestedIncludeMap<NodeDef> = NodeDef extends { include?: infer M } ? NonNullable<M> : never;

/**
 * Project an entity through a `select` shape. Mirrors the runtime
 * `selectFields` + `WithRootIdSelected` behaviour:
 *   - `true`           -> full entity
 *   - `{ a: true }`    -> `Pick<Entity, 'a' | 'id' | '__model'>`
 *   - missing          -> full entity
 */
type Selected<Entity, Sel> = [Sel] extends [true]
  ? Entity
  : Sel extends Record<string, any>
    ? { [K in (Extract<keyof Sel, keyof Entity> | 'id' | '__model') & keyof Entity]: Entity[K] }
    : Entity;

/**
 * Walk the user-provided `include` literal one key at a time. The corresponding
 * `IncludeMap` (from the parent model's schema entry) supplies the named
 * `IncludeNode` definition for each key, which carries its `__kind` / `__target`
 * brand and any nested `include?` map.
 */
type IncludeProjection<UserInc, ParentMap> =
  UserInc extends Record<string, any>
    ? ParentMap extends Record<string, any>
      ? { [K in keyof UserInc & keyof ParentMap]: ResolveIncludeNode<UserInc[K], NonNullable<ParentMap[K]>> }
      : {}
    : {};

type ResolveIncludeNode<UserNode, NodeDef> =
  NodeDef extends IncludeNodeMarker<infer Kind, infer Target>
    ? Target extends object
      ? Selected<Target, ExtractSelect<UserNode>> &
          IncludeProjection<ExtractInclude<UserNode>, GetNestedIncludeMap<NodeDef>> extends infer Projection
        ? Kind extends 'many'
          ? Projection[]
          : Kind extends 'singleNullable'
            ? Projection | null
            : Projection
        : never
      : never
    : never;

// =============================================================================
// ENTITY SHAPES
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

// =============================================================================
// PER-MODEL SELECT SHAPES
// =============================================================================

type UserSelectMap = { [K in Exclude<keyof UserEntity, '__model'>]?: true };
type UserSelect = true | UserSelectMap;

type WorkspaceSelectMap = { [K in Exclude<keyof WorkspaceEntity, '__model'>]?: true };
type WorkspaceSelect = true | WorkspaceSelectMap;

type WorkspaceMemberSelectMap = { [K in Exclude<keyof WorkspaceMemberEntity, '__model'>]?: true };
type WorkspaceMemberSelect = true | WorkspaceMemberSelectMap;

type WorkspaceMemberInviteSelectMap = { [K in Exclude<keyof WorkspaceMemberInviteEntity, '__model'>]?: true };
type WorkspaceMemberInviteSelect = true | WorkspaceMemberInviteSelectMap;

type WorkspaceTicketLabelSelectMap = { [K in Exclude<keyof WorkspaceTicketLabelEntity, '__model'>]?: true };
type WorkspaceTicketLabelSelect = true | WorkspaceTicketLabelSelectMap;

type TicketSelectMap = { [K in Exclude<keyof TicketEntity, '__model'>]?: true };
type TicketSelect = true | TicketSelectMap;

type TicketListSelectMap = { [K in Exclude<keyof TicketListEntity, '__model'>]?: true };
type TicketListSelect = true | TicketListSelectMap;

type TicketAssigneeSelectMap = { [K in Exclude<keyof TicketAssigneeEntity, '__model'>]?: true };
type TicketAssigneeSelect = true | TicketAssigneeSelectMap;

type TicketReporterSelectMap = { [K in Exclude<keyof TicketReporterEntity, '__model'>]?: true };
type TicketReporterSelect = true | TicketReporterSelectMap;

type TicketAttachmentSelectMap = { [K in Exclude<keyof TicketAttachmentEntity, '__model'>]?: true };
type TicketAttachmentSelect = true | TicketAttachmentSelectMap;

type TicketCommentSelectMap = { [K in Exclude<keyof TicketCommentEntity, '__model'>]?: true };
type TicketCommentSelect = true | TicketCommentSelectMap;

type TicketLabelSelectMap = { [K in Exclude<keyof TicketLabelEntity, '__model'>]?: true };
type TicketLabelSelect = true | TicketLabelSelectMap;

// =============================================================================
// INCLUDE NODES (one named interface per parent x include relation)
//
// Each node carries its arity (`single` / `singleNullable` / `many`) and target
// entity through the IncludeNodeMarker phantom brand. Recursion into nested
// includes is achieved by referencing the relation's own IncludeMap by name,
// which is what makes deep paths cheap for the type checker.
// =============================================================================

// workspace -> owner (workspaceMember, single)
interface Workspace_Owner_IncludeNode extends IncludeNodeMarker<'single', WorkspaceMemberEntity> {
  select: WorkspaceMemberSelect;
}

// workspaceMemberInvite -> workspace (single)
interface WorkspaceMemberInvite_Workspace_IncludeNode extends IncludeNodeMarker<'single', WorkspaceEntity> {
  select: WorkspaceSelect;
  include?: WorkspaceIncludeMap;
}

// ticket -> assignee (singleNullable)
interface Ticket_Assignee_IncludeNode extends IncludeNodeMarker<'singleNullable', TicketAssigneeEntity> {
  select: TicketAssigneeSelect;
}

// ticket -> reporter (single)
interface Ticket_Reporter_IncludeNode extends IncludeNodeMarker<'single', TicketReporterEntity> {
  select: TicketReporterSelect;
}

// ticket -> attachments (many, with query args)
interface Ticket_Attachments_IncludeNode extends IncludeNodeMarker<'many', TicketAttachmentEntity> {
  query: { order: 'asc' | 'desc' };
  select: TicketAttachmentSelect;
}

// ticket -> comments (many, with query args)
interface Ticket_Comments_IncludeNode extends IncludeNodeMarker<'many', TicketCommentEntity> {
  query: { order: 'asc' | 'desc' };
  select: TicketCommentSelect;
}

// ticket -> labels (many, with query args)
interface Ticket_Labels_IncludeNode extends IncludeNodeMarker<'many', TicketLabelEntity> {
  query: { order: 'asc' | 'desc' };
  select: TicketLabelSelect;
}

// ticketList -> tickets (many, with query args; ticket has further includes)
interface TicketList_Tickets_IncludeNode extends IncludeNodeMarker<'many', TicketEntity> {
  query: { limit: number; order: 'asc' | 'desc' };
  select: TicketSelect;
  include?: TicketIncludeMap;
}

// =============================================================================
// PER-MODEL INCLUDE MAPS
//
// Models without any includes (user, workspaceMember, workspaceTicketLabel,
// ticketAssignee, ticketReporter, ticketAttachment, ticketComment, ticketLabel)
// intentionally have no IncludeMap; their root inputs simply omit `include`.
// =============================================================================

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

// =============================================================================
// PER-QUERY INPUT INTERFACES
// =============================================================================

// ---- user ----
export interface UserByIdInput {
  query: { id: string };
  select: UserSelect;
}

// ---- workspace ----
export interface WorkspaceByIdInput {
  query: { id: string };
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
  query: { id: string };
  select: WorkspaceMemberSelect;
}

export interface WorkspaceMembersInput {
  query: { workspaceId: string };
  select: WorkspaceMemberSelect;
}

// ---- workspaceMemberInvite ----
export interface WorkspaceMemberInviteByIdInput {
  query: { id: string };
  select: WorkspaceMemberInviteSelect;
  include?: WorkspaceMemberInviteIncludeMap;
}

export interface MyWorkspaceInvitesInput {
  query: {};
  select: WorkspaceMemberInviteSelect;
  include?: WorkspaceMemberInviteIncludeMap;
}

export interface WorkspaceMemberInvitesInput {
  query: { workspaceId: string };
  select: WorkspaceMemberInviteSelect;
  include?: WorkspaceMemberInviteIncludeMap;
}

// ---- workspaceTicketLabel ----
export interface WorkspaceTicketLabelByIdInput {
  query: { id: string };
  select: WorkspaceTicketLabelSelect;
}

export interface WorkspaceTicketLabelsInput {
  query: { workspaceId: string };
  select: WorkspaceTicketLabelSelect;
}

// ---- ticket ----
export interface TicketByIdInput {
  query: { id: string };
  select: TicketSelect;
  include?: TicketIncludeMap;
}

export interface TicketsInput {
  query: { workspaceId: string; limit: number; order: 'asc' | 'desc' };
  select: TicketSelect;
  include?: TicketIncludeMap;
}

// ---- ticketList ----
export interface TicketListByIdInput {
  query: { id: string };
  select: TicketListSelect;
  include?: TicketListIncludeMap;
}

export interface TicketListsInput {
  query: { workspaceId: string; limit: number; order: 'asc' | 'desc' };
  select: TicketListSelect;
  include?: TicketListIncludeMap;
}

// ---- ticketAssignee ----
export interface TicketAssigneeByIdInput {
  query: { id: string };
  select: TicketAssigneeSelect;
}

// ---- ticketReporter ----
export interface TicketReporterByIdInput {
  query: { id: string };
  select: TicketReporterSelect;
}

// ---- ticketAttachment ----
export interface TicketAttachmentByIdInput {
  query: { id: string };
  select: TicketAttachmentSelect;
}

export interface TicketAttachmentsInput {
  query: { ticketId: string; order: 'asc' | 'desc' };
  select: TicketAttachmentSelect;
}

// ---- ticketComment ----
export interface TicketCommentByIdInput {
  query: { id: string };
  select: TicketCommentSelect;
}

export interface TicketCommentsInput {
  query: { ticketId: string; order: 'asc' | 'desc' };
  select: TicketCommentSelect;
}

// ---- ticketLabel ----
export interface TicketLabelByIdInput {
  query: { id: string };
  select: TicketLabelSelect;
}

export interface TicketLabelsInput {
  query: { ticketId: string; order: 'asc' | 'desc' };
  select: TicketLabelSelect;
}

// =============================================================================
// AGGREGATE INPUT MAP
// =============================================================================

export interface QueryInputMap {
  userById: UserByIdInput;
  workspaceById: WorkspaceByIdInput;
  myWorkspaces: MyWorkspacesInput;
  workspaceMemberById: WorkspaceMemberByIdInput;
  workspaceMembers: WorkspaceMembersInput;
  workspaceMemberInviteById: WorkspaceMemberInviteByIdInput;
  myWorkspaceInvites: MyWorkspaceInvitesInput;
  workspaceMemberInvites: WorkspaceMemberInvitesInput;
  workspaceTicketLabelById: WorkspaceTicketLabelByIdInput;
  workspaceTicketLabels: WorkspaceTicketLabelsInput;
  ticketById: TicketByIdInput;
  tickets: TicketsInput;
  ticketListById: TicketListByIdInput;
  ticketLists: TicketListsInput;
  ticketAssigneeById: TicketAssigneeByIdInput;
  ticketReporterById: TicketReporterByIdInput;
  ticketAttachmentById: TicketAttachmentByIdInput;
  ticketAttachments: TicketAttachmentsInput;
  ticketCommentById: TicketCommentByIdInput;
  ticketComments: TicketCommentsInput;
  ticketLabelById: TicketLabelByIdInput;
  ticketLabels: TicketLabelsInput;
}

// =============================================================================
// QUERY REGISTRY (entity + arity + nullability + parent include map)
//
// Drives projection in `HandleQueryResponse` without any per-query data type
// declarations.
// =============================================================================

interface QueryRegistry {
  userById: { entity: UserEntity; kind: 'single'; nullable: false; includeMap: never };
  workspaceById: { entity: WorkspaceEntity; kind: 'single'; nullable: false; includeMap: WorkspaceIncludeMap };
  myWorkspaces: { entity: WorkspaceEntity; kind: 'many'; nullable: false; includeMap: WorkspaceIncludeMap };
  workspaceMemberById: { entity: WorkspaceMemberEntity; kind: 'single'; nullable: false; includeMap: never };
  workspaceMembers: { entity: WorkspaceMemberEntity; kind: 'many'; nullable: false; includeMap: never };
  workspaceMemberInviteById: {
    entity: WorkspaceMemberInviteEntity;
    kind: 'single';
    nullable: false;
    includeMap: WorkspaceMemberInviteIncludeMap;
  };
  myWorkspaceInvites: {
    entity: WorkspaceMemberInviteEntity;
    kind: 'many';
    nullable: false;
    includeMap: WorkspaceMemberInviteIncludeMap;
  };
  workspaceMemberInvites: {
    entity: WorkspaceMemberInviteEntity;
    kind: 'many';
    nullable: false;
    includeMap: WorkspaceMemberInviteIncludeMap;
  };
  workspaceTicketLabelById: { entity: WorkspaceTicketLabelEntity; kind: 'single'; nullable: false; includeMap: never };
  workspaceTicketLabels: { entity: WorkspaceTicketLabelEntity; kind: 'many'; nullable: false; includeMap: never };
  ticketById: { entity: TicketEntity; kind: 'single'; nullable: false; includeMap: TicketIncludeMap };
  tickets: { entity: TicketEntity; kind: 'many'; nullable: false; includeMap: TicketIncludeMap };
  ticketListById: { entity: TicketListEntity; kind: 'single'; nullable: false; includeMap: TicketListIncludeMap };
  ticketLists: { entity: TicketListEntity; kind: 'many'; nullable: false; includeMap: TicketListIncludeMap };
  ticketAssigneeById: { entity: TicketAssigneeEntity; kind: 'single'; nullable: false; includeMap: never };
  ticketReporterById: { entity: TicketReporterEntity; kind: 'single'; nullable: false; includeMap: never };
  ticketAttachmentById: { entity: TicketAttachmentEntity; kind: 'single'; nullable: false; includeMap: never };
  ticketAttachments: { entity: TicketAttachmentEntity; kind: 'many'; nullable: false; includeMap: never };
  ticketCommentById: { entity: TicketCommentEntity; kind: 'single'; nullable: false; includeMap: never };
  ticketComments: { entity: TicketCommentEntity; kind: 'many'; nullable: false; includeMap: never };
  ticketLabelById: { entity: TicketLabelEntity; kind: 'single'; nullable: false; includeMap: never };
  ticketLabels: { entity: TicketLabelEntity; kind: 'many'; nullable: false; includeMap: never };
}

// =============================================================================
// PROJECTION + RESPONSE
// =============================================================================

type QueryData<K extends keyof QueryRegistry, Input> = QueryRegistry[K] extends {
  entity: infer E extends object;
  kind: infer Kind;
  nullable: infer Nullable;
  includeMap: infer ParentMap;
}
  ? Selected<E, ExtractSelect<Input>> & IncludeProjection<ExtractInclude<Input>, ParentMap> extends infer Projection
    ? Kind extends 'many'
      ? Projection[]
      : Nullable extends true
        ? Projection | null
        : Projection
    : never
  : never;

export type HandleQueryResponse<Q extends Partial<QueryInputMap>> = {
  [K in keyof Q & keyof QueryInputMap]: {
    data: (Q[K] extends QueryInputMap[K] ? QueryData<K, Q[K]> : never) | null;
    error: FormattedTQLServerError | null;
  };
};

// =============================================================================
// handleQuery — type-only stub
//
// Real execution still flows through QueryResolver.handle in
// ../query/query-resolver.ts. This entry point exists purely to demonstrate
// that the static schema above resolves the `data` shape cheaply without
// touching the FlattenedQueriesInput / HandleQueryResponse generic chain.
// =============================================================================

export function handleQuery<const Q extends Partial<QueryInputMap>>(query: Q): HandleQueryResponse<Q> {
  void query;

  return null as unknown as HandleQueryResponse<Q>;
}
