import z from 'zod';

import { schema } from '../../schema';

export const createTicketList = schema.mutation('createTicketList', {
  input: z.object({
    workspaceId: z.string(),
    name: z.string().min(1),
  }),

  changed: {
    ticketList: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketList = await context.ticketListsService.create(context.user, {
      workspaceId: input.workspaceId,
      name: input.name,
    });

    return {
      ticketList: {
        inserts: [ticketList],
      },
    };
  },
});
