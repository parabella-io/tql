import z from 'zod';

import { schema } from '../../schema';

export const deleteTicketList = schema.mutation('deleteTicketList', {
  input: z.object({
    id: z.string(),
  }),

  changed: {
    ticketList: {
      deletes: true,
    },
  },

  allow: async ({ context, input }) => {
    const ticketList = await context.db.ticketList.findUnique({
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
    const ticketList = await context.ticketListsService.delete(context.user, {
      id: input.id,
    });

    return {
      ticketList: {
        deletes: [ticketList],
      },
    };
  },
});
