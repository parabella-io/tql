import z from 'zod';

import { schema } from '../../schema';

import { workspaceMemberInviteService } from '../../../services';

export const removeInviteWorkspaceMember = schema.mutation('removeInviteWorkspaceMember', {
  input: z.object({
    workspaceId: z.string(),
    inviteId: z.string(),
  }),

  changed: {
    workspaceMemberInvite: {
      deletes: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceMemberInvite = await workspaceMemberInviteService.remove(context.user, {
      workspaceId: input.workspaceId,
      inviteId: input.inviteId,
    });

    return {
      workspaceMemberInvite: {
        deletes: [workspaceMemberInvite],
      },
    };
  },
});
