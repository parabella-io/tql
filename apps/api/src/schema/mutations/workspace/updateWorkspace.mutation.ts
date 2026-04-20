import z from 'zod';

import { schema } from '../../schema';

export const updateWorkspace = schema.mutation('updateWorkspace', {
  input: z.object({
    workspaceId: z.string(),
    name: z.string(),
  }),

  changed: {
    workspace: {
      updates: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspace = await context.workspaceService.updateWorkspace(context.user, {
      id: input.workspaceId,
      name: input.name,
    });

    return {
      workspace: {
        updates: [workspace],
      },
    };
  },
});
