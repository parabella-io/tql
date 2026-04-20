import z from 'zod';

import { schema } from '../../schema';

export const inviteWorkspaceMember = schema.mutation('inviteWorkspaceMember', {
  input: z.object({
    workspaceId: z.string(),
    email: z.email(),
  }),

  changed: {
    workspaceMemberInvite: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceMemberInvite = await context.workspaceMemberInviteService.invite(context.user, {
      workspaceId: input.workspaceId,
      email: input.email,
    });

    return {
      workspaceMemberInvite: {
        inserts: [workspaceMemberInvite],
      },
    };
  },
});
