import z from 'zod';

import { schema } from '../../schema';

import { db } from '../../../database-client';

import { workspaceMemberInviteService } from '../../../services';

export const declineWorkspaceMemberInvite = schema.mutation('declineWorkspaceMemberInvite', {
  input: z.object({
    workspaceId: z.string(),
    inviteId: z.string(),
  }),

  changed: {
    workspaceMemberInvite: {
      deletes: true,
    },
  },

  allow: async ({ context, input }) => {
    const workspaceMemberInvite = await db.workspaceMemberInvite.findUniqueOrThrow({
      where: {
        id: input.inviteId,
      },
    });

    if (!workspaceMemberInvite) {
      throw new Error('Workspace member invite not found');
    }

    if (workspaceMemberInvite.email !== context.user.email) {
      throw new Error('You are not the invitee');
    }

    return true;
  },

  resolve: async ({ context, input }) => {
    const workspaceMemberInvite = await workspaceMemberInviteService.decline(context.user, {
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
