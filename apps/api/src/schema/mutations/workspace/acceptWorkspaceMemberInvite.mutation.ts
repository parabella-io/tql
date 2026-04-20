import z from 'zod';

import { schema } from '../../schema';

export const acceptWorkspaceMemberInvite = schema.mutation('acceptWorkspaceMemberInvite', {
  input: z.object({
    workspaceId: z.string(),
    inviteId: z.string(),
  }),

  changed: {
    workspace: {
      inserts: true,
    },
    workspaceMember: {
      inserts: true,
    },
    workspaceMemberInvite: {
      deletes: true,
    },
  },

  allow: async ({ context, input }) => {
    const workspaceMemberInvite = await context.db.workspaceMemberInvite.findUniqueOrThrow({
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
    const { workspaceMember, workspaceMemberInvite, workspace } = await context.workspaceMemberInviteService.accept(context.user, {
      workspaceId: input.workspaceId,
      inviteId: input.inviteId,
    });

    return {
      workspace: {
        inserts: [workspace],
      },
      workspaceMember: {
        inserts: [workspaceMember],
      },
      workspaceMemberInvite: {
        deletes: [workspaceMemberInvite],
      },
    };
  },
});
