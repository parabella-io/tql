import { z } from 'zod';

import { schema } from '../../schema';

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
        return context.ticketListsService.getById(context.user, {
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
        return context.ticketListsService.queryByWorkspaceId(context.user, {
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
        return context.ticketsService.queryByTicketListIds(context.user, {
          ticketListIds: parents.map((parent) => parent.id),
          limit: query.limit,
          order: query.order,
        });
      },
    }),
  }),
});
