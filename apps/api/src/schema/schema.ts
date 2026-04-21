import { Schema, type SchemaEntity } from '@tql/server';

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

export type NotificationEntity = SchemaEntity<{
  userId: string;
  data: Record<string, any>;
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
  notification: NotificationEntity;
};

export type UserContext = {
  id: string;
  email: string;
  workspaceIds: string[];
};

export type SchemaContext = {
  user: UserContext;
};

export type SchemaConnection = {
  user: UserContext;
};

export const schema = new Schema<SchemaContext, SchemaEntities, SchemaConnection>();
