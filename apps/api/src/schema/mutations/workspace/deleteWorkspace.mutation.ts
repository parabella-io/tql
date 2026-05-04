import z from 'zod';

import { workspaceOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const deleteWorkspace = schema.mutation('deleteWorkspace', {
  input: z.object({
    id: z.string().min(1),
  }),

  output: z.object({
    workspace: workspaceOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.id);
  },

  resolve: async ({ context, input }) => {
    const workspace = await context.workspaceService.deleteWorkspace(context.user, {
      id: input.id,
    });

    return {
      workspace,
    };
  },
});
