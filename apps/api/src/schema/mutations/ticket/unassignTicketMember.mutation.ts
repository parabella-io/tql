import z from 'zod';
import { ticketAssigneeOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';
import { ticketAssigneeService } from '../../../services';

export const unassignTicketMember = schema.mutation('unassignTicketMember', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
  }),

  output: z.object({
    ticketAssignee: ticketAssigneeOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketAssignee = await ticketAssigneeService.unassign(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
    });

    return {
      ticketAssignee,
    };
  },
});
