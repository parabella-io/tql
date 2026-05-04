import z from 'zod';

import { workspaceTicketLabelOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const deleteWorkspaceTicketLabel = schema.mutation('deleteWorkspaceTicketLabel', {
  input: z.object({
    workspaceId: z.string(),
    id: z.string(),
  }),

  output: z.object({
    workspaceTicketLabel: workspaceTicketLabelOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceTicketLabel = await context.workspaceTicketLabelService.delete(context.user, {
      workspaceId: input.workspaceId,
      id: input.id,
    });

    return {
      workspaceTicketLabel,
    };
  },
});
