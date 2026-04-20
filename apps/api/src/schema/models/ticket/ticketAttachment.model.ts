import { z } from 'zod';

import { schema } from '../../schema';

export const ticketAttachment = schema.model('ticketAttachment', {
  schema: z.object({
    id: z.string(),
    ticketId: z.string(),
    key: z.string(),
    name: z.string(),
    size: z.number(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    ticketId: field(),
    key: field(),
    name: field(),
    size: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    ticketAttachmentById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return context.ticketAttachmentsService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    ticketAttachments: queryMany({
      query: z.object({
        ticketId: z.string(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        return context.ticketAttachmentsService.queryByTicketId(context.user, query);
      },
    }),
  }),
});
