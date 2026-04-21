import { z } from 'zod';

import { schema } from '../../schema';

import { ticketCommentsService } from '../../../services';

export const ticketComment = schema.model('ticketComment', {
  schema: z.object({
    id: z.string(),
    content: z.string(),
    ticketId: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    content: field(),
    ticketId: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    ticketCommentById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return ticketCommentsService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    ticketComments: queryMany({
      query: z.object({
        ticketId: z.string(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        return ticketCommentsService.queryByTicketId(context.user, {
          ticketId: query.ticketId,
          order: query.order,
        });
      },
    }),
  }),
});
