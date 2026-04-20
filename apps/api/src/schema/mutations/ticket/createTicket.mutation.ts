import z from 'zod';

import { schema } from '../../schema';

export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    ticketListId: z.string(),
    title: z.string().min(1),
  }),

  changed: {
    ticket: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await context.ticketsService.create(context.user, {
      workspaceId: input.workspaceId,
      ticketListId: input.ticketListId,
      title: input.title,
    });

    return {
      ticket: {
        inserts: [ticket],
      },
    };
  },
});
