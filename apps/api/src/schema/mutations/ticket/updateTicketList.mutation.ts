import z from 'zod';

import { ticketListOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const updateTicketList = schema.mutation('updateTicketList', {
  input: z.object({
    id: z.string(),
    name: z.string().min(1),
  }),

  output: z.object({
    ticketList: ticketListOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.id);
  },

  resolve: async ({ context, input }) => {
    const ticketList = await context.ticketListsService.update(context.user, {
      id: input.id,
      name: input.name,
    });

    return {
      ticketList,
    };
  },
});
