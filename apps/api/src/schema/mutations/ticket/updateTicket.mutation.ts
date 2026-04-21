import z from 'zod';

import { schema } from '../../schema';

import { ticketsService } from '../../../services';

export const updateTicket = schema.mutation('updateTicket', {
  input: z.object({
    id: z.string(),
    description: z.string(),
    title: z.string().min(1),
  }),

  changed: {
    ticket: {
      updates: true,
    },
  },

  allow: async ({ context, input }) => {
    const ticket = await ticketsService.getById(context.user, {
      id: input.id,
    });

    return context.user.workspaceIds.includes(ticket.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.update(context.user, {
      id: input.id,
      title: input.title,
      description: input.description,
    });

    return {
      ticket: {
        updates: [ticket],
      },
    };
  },
});
