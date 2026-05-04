import z from 'zod';

export const userOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const workspaceOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const workspaceMemberOutputSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  workspaceId: z.string(),
  isWorkspaceOwner: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const workspaceMemberInviteOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  workspaceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const workspaceTicketLabelOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ticketOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  workspaceId: z.string(),
  ticketListId: z.string(),
  assigneeId: z.string().nullable(),
  reporterId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ticketListOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ticketAssigneeOutputSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  userId: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ticketAttachmentOutputSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  key: z.string(),
  name: z.string(),
  size: z.number(),
  workspaceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ticketLabelOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspaceTicketLabelId: z.string(),
  ticketId: z.string(),
  workspaceId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
