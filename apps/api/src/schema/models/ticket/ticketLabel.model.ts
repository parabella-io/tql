import { z } from 'zod';
import { schema } from '../../schema';
import { ticketLabelsService } from '../../../services';

export const ticketLabel = schema.model('ticketLabel', {
  schema: z.object({
    id: z.string(),
    name: z.string(),
    workspaceTicketLabelId: z.string(),
    ticketId: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    name: field(),
    workspaceTicketLabelId: field(),
    ticketId: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    ticketLabelById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return ticketLabelsService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    ticketLabels: queryMany({
      query: z.object({
        ticketId: z.string(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        return ticketLabelsService.queryByTicketId(context.user, {
          ticketId: query.ticketId,
          order: query.order,
        });
      },
    }),
  }),
});
