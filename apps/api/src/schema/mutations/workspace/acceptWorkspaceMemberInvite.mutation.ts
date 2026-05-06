import z from 'zod';
import { workspaceMemberInviteOutputSchema, workspaceMemberOutputSchema, workspaceOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { db } from '../../../database-client';
import { workspaceMemberInviteService } from '../../../services';

export const acceptWorkspaceMemberInvite = schema.mutation('acceptWorkspaceMemberInvite', {
  input: z.object({
    workspaceId: z.string(),
    inviteId: z.string(),
  }),

  output: z.object({
    workspace: workspaceOutputSchema,
    workspaceMember: workspaceMemberOutputSchema,
    workspaceMemberInvite: workspaceMemberInviteOutputSchema,
  }),

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
    const { workspaceMember, workspaceMemberInvite, workspace } = await workspaceMemberInviteService.accept(context.user, {
      workspaceId: input.workspaceId,
      inviteId: input.inviteId,
    });

    return {
      workspace,
      workspaceMember,
      workspaceMemberInvite,
    };
  },
});
