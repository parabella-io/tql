import { db } from '../database-client';
import { WorkspaceService } from './workspace/workspace.service';
import { TicketsService } from './ticket/tickets.service';
import { TicketAttachmentsService } from './ticket/ticketAttachments.service';
import { TicketLabelsService } from './ticket/ticketLabels.service';
import { TicketCommentsService } from './ticket/ticketComments.service';
import { WorkspaceMemberService } from './workspace/workspaceMember.service';
import { TicketAssigneeService } from './ticket/ticketAssignee.service';
import { TicketReporterService } from './ticket/ticketReporter.service';
import { TicketListsService } from './ticket/ticketList.service';
import { StorageService } from './storage/storage.service';
import { WorkspaceTicketLabelService } from './workspace/workspaceTicketLabel.service';
import { WorkspaceMemberInviteService } from './workspace/workspaceMemberInvite.service';
import { UserService } from './user/user.service';

export const userService = new UserService(db);

export const workspaceService = new WorkspaceService(db);
export const workspaceMemberService = new WorkspaceMemberService(db);
export const workspaceTicketLabelService = new WorkspaceTicketLabelService(db);
export const workspaceMemberInviteService = new WorkspaceMemberInviteService(db);

export const ticketsService = new TicketsService(db);
export const ticketListsService = new TicketListsService(db);
export const ticketAssigneeService = new TicketAssigneeService(db);
export const ticketReporterService = new TicketReporterService(db);
export const ticketAttachmentsService = new TicketAttachmentsService(db);
export const ticketCommentsService = new TicketCommentsService(db);
export const ticketLabelsService = new TicketLabelsService(db);

export const storageService = new StorageService(db);
