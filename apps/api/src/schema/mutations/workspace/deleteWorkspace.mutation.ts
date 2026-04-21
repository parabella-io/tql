import z from 'zod';

import { schema } from '../../schema';

import { workspaceService } from '../../../services';

export const deleteWorkspace = schema.mutation('deleteWorkspace', {
  input: z.object({
    id: z.string().min(1),
  }),

  changed: {
    workspace: {
      deletes: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.id);
  },

  resolve: async ({ context, input }) => {
    const workspace = await workspaceService.deleteWorkspace(context.user, {
      id: input.id,
    });

    return {
      workspace: {
        deletes: [workspace],
      },
    };
  },
});
