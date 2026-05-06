import z from 'zod';
import { workspaceMemberService } from '../../../services';
import { workspaceMemberOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const removeWorkspaceMember = schema.mutation('removeWorkspaceMember', {
  input: z.object({
    workspaceId: z.string(),
    memberId: z.string(),
  }),

  output: z.object({
    workspaceMember: workspaceMemberOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceMember = await workspaceMemberService.remove(context.user, {
      workspaceId: input.workspaceId,
      memberId: input.memberId,
    });

    return {
      workspaceMember,
    };
  },
});
