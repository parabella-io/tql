import z from 'zod';

import { ticketOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const updateTicket = schema.mutation('updateTicket', {
  input: z.object({
    id: z.string(),
    description: z.string(),
    title: z.string().min(1),
  }),

  output: z.object({
    ticket: ticketOutputSchema,
  }),

  allow: async ({ context, input }) => {
    const ticket = await context.ticketsService.getById(context.user, {
      id: input.id,
    });

    return context.user.workspaceIds.includes(ticket.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await context.ticketsService.update(context.user, {
      id: input.id,
      title: input.title,
      description: input.description,
    });

    return {
      ticket,
    };
  },
});
