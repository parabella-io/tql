import z from 'zod';

import { ticketAttachmentOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const deleteTicketAttachment = schema.mutation('deleteTicketAttachment', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    attachmentId: z.string(),
  }),

  output: z.object({
    ticketAttachment: ticketAttachmentOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketAttachment = await context.ticketAttachmentsService.delete(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      id: input.attachmentId,
    });

    await context.storageService.deleteFile(ticketAttachment.key).catch(console.log);

    return {
      ticketAttachment,
    };
  },
});
