import z from 'zod';

import { schema } from '../../schema';

export const createWorkspace = schema.mutation('createWorkspace', {
  input: z.object({
    name: z.string().min(1),
  }),

  changed: {
    workspace: {
      inserts: true,
    },
  },

  allow: ({ context }) => {
    return !!context.user.id;
  },

  resolve: async ({ context, input }) => {
    const workspace = await context.workspaceService.createWorkspace(context.user, {
      name: input.name,
    });

    return {
      workspace: {
        inserts: [workspace],
      },
    };
  },
});
