import z from 'zod';

import { workspaceTicketLabelOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const createWorkspaceTicketLabel = schema.mutation('createWorkspaceTicketLabel', {
  input: z.object({
    workspaceId: z.string(),
    name: z.string().min(1),
  }),

  output: z.object({
    workspaceTicketLabel: workspaceTicketLabelOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceTicketLabel = await context.workspaceTicketLabelService.create(context.user, {
      workspaceId: input.workspaceId,
      name: input.name,
    });

    return {
      workspaceTicketLabel,
    };
  },
});
