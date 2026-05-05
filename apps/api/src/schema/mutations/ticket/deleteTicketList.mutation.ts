import z from 'zod';
import { ticketListOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { db } from '../../../database-client';
import { ticketListsService } from '../../../services';

export const deleteTicketList = schema.mutation('deleteTicketList', {
  input: z.object({
    id: z.string(),
  }),

  output: z.object({
    ticketList: ticketListOutputSchema,
  }),

  allow: async ({ context, input }) => {
    const ticketList = await db.ticketList.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!ticketList) {
      throw new Error('Ticket list not found');
    }

    return context.user.workspaceIds.includes(ticketList.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketList = await ticketListsService.delete(context.user, {
      id: input.id,
    });

    return {
      ticketList,
    };
  },
});
