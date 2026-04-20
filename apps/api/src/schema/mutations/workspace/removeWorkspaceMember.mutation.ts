import z from 'zod';

import { schema } from '../../schema';

export const removeWorkspaceMember = schema.mutation('removeWorkspaceMember', {
  input: z.object({
    workspaceId: z.string(),
    memberId: z.string(),
  }),

  changed: {
    workspaceMember: {
      deletes: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceMember = await context.workspaceMemberService.remove(context.user, {
      workspaceId: input.workspaceId,
      memberId: input.memberId,
    });

    return {
      workspaceMember: {
        deletes: [workspaceMember],
      },
    };
  },
});
