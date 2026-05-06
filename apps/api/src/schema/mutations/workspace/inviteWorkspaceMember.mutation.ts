import z from 'zod';
import { workspaceMemberInviteService } from '../../../services';
import { workspaceMemberInviteOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const inviteWorkspaceMember = schema.mutation('inviteWorkspaceMember', {
  input: z.object({
    workspaceId: z.string(),
    email: z.email(),
  }),

  output: z.object({
    workspaceMemberInvite: workspaceMemberInviteOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceMemberInvite = await workspaceMemberInviteService.invite(context.user, {
      workspaceId: input.workspaceId,
      email: input.email,
    });

    return {
      workspaceMemberInvite,
    };
  },
});
