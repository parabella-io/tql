import { z } from 'zod';

import { schema } from '../../schema';

import {
  ticketsService,
  ticketAssigneeService,
  ticketReporterService,
  ticketAttachmentsService,
  ticketCommentsService,
  ticketLabelsService,
} from '../../../services';

export const ticket = schema.model('ticket', {
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    workspaceId: z.string(),
    ticketListId: z.string(),
    assigneeId: z.string().nullable(),
    reporterId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    title: field(),
    description: field(),
    ticketListId: field(),
    workspaceId: field(),
    assigneeId: field(),
    reporterId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    ticketById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      rateLimit: { cost: 1 },
      resolve: async ({ context, query }) => {
        return ticketsService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    tickets: queryMany({
      query: z.object({
        workspaceId: z.string(),
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      rateLimit: { cost: 5 },
      resolve: async ({ context, query }) => {
        return ticketsService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
          limit: query.limit,
          order: query.order,
        });
      },
    }),
  }),

  includes: ({ includeSingle, includeMany }) => ({
    assignee: includeSingle('ticketAssignee', {
      nullable: true,
      matchKey: 'ticketId',
      rateLimit: { cost: 1 },
      resolve: async ({ context, parents }) => {
        return ticketAssigneeService.queryByTicketIds(context.user, {
          ticketIds: parents.map((parent) => parent.id),
        });
      },
    }),

    reporter: includeSingle('ticketReporter', {
      matchKey: 'ticketId',
      rateLimit: { cost: 1 },
      resolve: async ({ context, parents }) => {
        return ticketReporterService.queryByTicketIds(context.user, {
          ticketIds: parents.map((parent) => parent.id),
        });
      },
    }),

    attachments: includeMany('ticketAttachment', {
      matchKey: 'ticketId',
      query: z.object({
        order: z.enum(['asc', 'desc']),
      }),
      rateLimit: { cost: 2 },
      resolve: async ({ context, query, parents }) => {
        return ticketAttachmentsService.queryByTicketIds(context.user, {
          ticketIds: parents.map((parent) => parent.id),
          order: query.order,
        });
      },
    }),

    comments: includeMany('ticketComment', {
      matchKey: 'ticketId',
      query: z.object({
        order: z.enum(['asc', 'desc']),
      }),
      rateLimit: { cost: 2 },
      resolve: async ({ context, query, parents }) => {
        return ticketCommentsService.queryByTicketIds(context.user, {
          ticketIds: parents.map((parent) => parent.id),
          order: query.order,
        });
      },
    }),

    labels: includeMany('ticketLabel', {
      matchKey: 'ticketId',
      query: z.object({
        order: z.enum(['asc', 'desc']),
      }),
      rateLimit: { cost: 2 },
      resolve: async ({ context, parents }) => {
        return ticketLabelsService.queryByTicketIds(context.user, {
          ticketIds: parents.map((parent) => parent.id),
          order: 'asc',
        });
      },
    }),
  }),
});
