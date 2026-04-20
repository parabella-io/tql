import { Schema, type SchemaEntity } from '@tql/server';
import { PrismaClient } from '../database';
import { WorkspaceService } from '../services/workspace/workspace.service';
import { TicketsService } from '../services/ticket/tickets.service';
import { TicketAttachmentsService } from '../services/ticket/ticketAttachments.service';
import { TicketLabelsService } from '../services/ticket/ticketLabels.service';
import { TicketCommentsService } from '../services/ticket/ticketComments.service';
import { WorkspaceMemberService } from '../services/workspace/workspaceMember.service';
import { TicketAssigneeService } from '../services/ticket/ticketAssignee.service';
import { TicketReporterService } from '../services/ticket/ticketReporter.service';
import { TicketListsService } from '../services/ticket/ticketList.service';
import { StorageService } from '../services/storage/storage.service';
import { WorkspaceTicketLabelService } from '../services/workspace/workspaceTicketLabel.service';
import { WorkspaceMemberInviteService } from '../services/workspace/workspaceMemberInvite.service';
import { UserService } from '../services/user/user.service';

export type UserEntity = SchemaEntity<{
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}>;

export type WorkspaceEntity = SchemaEntity<{
  name: string;
}>;

export type WorkspaceMemberEntity = SchemaEntity<{
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  isWorkspaceOwner: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type WorkspaceMemberInviteEntity = SchemaEntity<{
  email: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type WorkspaceTicketLabelEntity = SchemaEntity<{
  id: string;
  workspaceId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketListEntity = SchemaEntity<{
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketEntity = SchemaEntity<{
  title: string;
  description: string;
  workspaceId: string;
  ticketListId: string;
  assigneeId: string | null;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketAssigneeEntity = SchemaEntity<{
  ticketId: string;
  workspaceId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketReporterEntity = SchemaEntity<{
  id: string;
  ticketId: string;
  workspaceId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketAttachmentEntity = SchemaEntity<{
  key: string;
  name: string;
  size: number;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketCommentEntity = SchemaEntity<{
  content: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type TicketLabelEntity = SchemaEntity<{
  name: string;
  workspaceTicketLabelId: string;
  ticketId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type SchemaEntities = {
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
};

export type UserContext = {
  id: string;
  email: string;
  workspaceIds: string[];
};

export type SchemaContext = {
  db: PrismaClient;
  userService: UserService;
  workspaceService: WorkspaceService;
  workspaceMemberService: WorkspaceMemberService;
  workspaceTicketLabelService: WorkspaceTicketLabelService;
  workspaceMemberInviteService: WorkspaceMemberInviteService;
  ticketsService: TicketsService;
  ticketListsService: TicketListsService;
  ticketAttachmentsService: TicketAttachmentsService;
  ticketAssigneeService: TicketAssigneeService;
  ticketReporterService: TicketReporterService;
  ticketCommentsService: TicketCommentsService;
  ticketLabelsService: TicketLabelsService;
  storageService: StorageService;
  user: UserContext;
};

export const schema = new Schema<SchemaContext, SchemaEntities>();
