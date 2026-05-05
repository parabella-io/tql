import z from 'zod';
import { ticketOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { ticketsService } from '../../../services';

export const moveTicket = schema.mutation('moveTicket', {
  input: z.object({
    id: z.string(),
    oldTicketListId: z.string(),
    newTicketListId: z.string(),
  }),

  output: z.object({
    ticket: ticketOutputSchema,
  }),

  allow: async ({ context, input }) => {
    const ticket = await ticketsService.getById(context.user, {
      id: input.id,
    });

    return context.user.workspaceIds.includes(ticket.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.moveList(context.user, {
      id: input.id,
      oldTicketListId: input.oldTicketListId,
      newTicketListId: input.newTicketListId,
    });

    return {
      ticket,
    };
  },
});
