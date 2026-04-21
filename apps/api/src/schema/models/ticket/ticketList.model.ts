import { z } from 'zod';

import { schema } from '../../schema';

import { ticketsService, ticketListsService } from '../../../services';

export const ticketList = schema.model('ticketList', {
  schema: z.object({
    id: z.string(),
    name: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    name: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    ticketListById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: ({ context, query }) => {
        return ticketListsService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    ticketLists: queryMany({
      query: z.object({
        workspaceId: z.string(),
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        return ticketListsService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
        });
      },
    }),
  }),

  includes: ({ includeMany }) => ({
    tickets: includeMany('ticket', {
      matchKey: 'ticketListId',
      query: z.object({
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query, parents }) => {
        return ticketsService.queryByTicketListIds(context.user, {
          ticketListIds: parents.map((parent) => parent.id),
          limit: query.limit,
          order: query.order,
        });
      },
    }),
  }),
});
