import z from 'zod';

import { schema } from '../../schema';

import { ticketAttachmentsService } from '../../../services';

export const createTicketAttachment = schema.mutation('createTicketAttachment', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    name: z.string().min(1),
    size: z.number(),
    key: z.string(),
  }),

  changed: {
    ticketAttachment: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketAttachment = await ticketAttachmentsService.create(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      name: input.name,
      size: input.size,
      key: input.key,
    });

    return {
      ticketAttachment: {
        inserts: [ticketAttachment],
      },
    };
  },
});
