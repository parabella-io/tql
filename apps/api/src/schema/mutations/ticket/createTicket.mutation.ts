import z from 'zod';

import { ticketOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { ticketsService } from '../../../services';

export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    ticketListId: z.string(),
    title: z.string().min(1),
  }),

  output: z.object({
    ticket: ticketOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  rateLimit: { cost: 10 },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, {
      workspaceId: input.workspaceId,
      ticketListId: input.ticketListId,
      title: input.title,
    });

    return {
      ticket,
    };
  },
});
