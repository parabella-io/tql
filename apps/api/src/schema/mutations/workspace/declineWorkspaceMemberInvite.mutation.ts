import z from 'zod';

import { workspaceMemberInviteOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const declineWorkspaceMemberInvite = schema.mutation('declineWorkspaceMemberInvite', {
  input: z.object({
    workspaceId: z.string(),
    inviteId: z.string(),
  }),

  output: z.object({
    workspaceMemberInvite: workspaceMemberInviteOutputSchema,
  }),

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
    const workspaceMemberInvite = await context.workspaceMemberInviteService.decline(context.user, {
      workspaceId: input.workspaceId,
      inviteId: input.inviteId,
    });

    return {
      workspaceMemberInvite,
    };
  },
});
