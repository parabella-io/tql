import z from 'zod';
import { ticketAssigneeOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { ticketAssigneeService } from '../../../services';

export const assignTicketMember = schema.mutation('assignTicketMember', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    memberId: z.string(),
  }),

  output: z.object({
    ticketAssignee: ticketAssigneeOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketAssignee = await ticketAssigneeService.assign(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      memberId: input.memberId,
    });

    return {
      ticketAssignee,
    };
  },
});
