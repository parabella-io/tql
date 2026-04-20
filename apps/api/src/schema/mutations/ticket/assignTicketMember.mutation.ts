import z from 'zod';

import { schema } from '../../schema';

export const assignTicketMember = schema.mutation('assignTicketMember', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    memberId: z.string(),
  }),

  changed: {
    ticketAssignee: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketAssignee = await context.ticketAssigneeService.assign(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      memberId: input.memberId,
    });

    return {
      ticketAssignee: {
        inserts: [ticketAssignee],
      },
    };
  },
});
