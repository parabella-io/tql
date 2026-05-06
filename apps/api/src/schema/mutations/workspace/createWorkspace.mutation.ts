import z from 'zod';
import { workspaceOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { workspaceService } from '../../../services';

export const createWorkspace = schema.mutation('createWorkspace', {
  input: z.object({
    name: z.string().min(1),
  }),

  output: z.object({
    workspace: workspaceOutputSchema,
  }),

  allow: ({ context }) => {
    return !!context.user.id;
  },

  resolve: async ({ context, input }) => {
    const workspace = await workspaceService.createWorkspace(context.user, {
      name: input.name,
    });

    return {
      workspace,
    };
  },
});
