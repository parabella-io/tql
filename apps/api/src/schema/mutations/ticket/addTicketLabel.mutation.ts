import z from 'zod';
import { ticketLabelOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { ticketLabelsService } from '../../../services';

export const addTicketLabel = schema.mutation('addTicketLabel', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    labelId: z.string(),
  }),

  output: z.object({
    ticketLabel: ticketLabelOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketLabel = await ticketLabelsService.add(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      labelId: input.labelId,
    });

    return {
      ticketLabel,
    };
  },

  resolveEffects: async ({ context, output, input }) => {},
});
