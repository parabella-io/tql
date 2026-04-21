import z from 'zod';

import { schema } from '../../schema';

import { ticketAttachmentsService, storageService } from '../../../services';

export const deleteTicketAttachment = schema.mutation('deleteTicketAttachment', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    attachmentId: z.string(),
  }),

  changed: {
    ticketAttachment: {
      deletes: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketAttachment = await ticketAttachmentsService.delete(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      id: input.attachmentId,
    });

    await storageService.deleteFile(ticketAttachment.key).catch(console.log);

    return {
      ticketAttachment: {
        deletes: [ticketAttachment],
      },
    };
  },
});
