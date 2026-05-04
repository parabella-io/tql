import z from 'zod';

import { ticketListOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const createTicketList = schema.mutation('createTicketList', {
  input: z.object({
    workspaceId: z.string(),
    name: z.string().min(1),
  }),

  output: z.object({
    ticketList: ticketListOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketList = await context.ticketListsService.create(context.user, {
      workspaceId: input.workspaceId,
      name: input.name,
    });

    return {
      ticketList,
    };
  },
});
