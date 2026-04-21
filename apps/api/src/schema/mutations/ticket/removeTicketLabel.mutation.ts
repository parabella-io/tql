import z from 'zod';

import { schema } from '../../schema';

import { ticketLabelsService } from '../../../services';

export const removeTicketLabel = schema.mutation('removeTicketLabel', {
  input: z.object({
    id: z.string(),
    workspaceId: z.string(),
    ticketId: z.string(),
  }),

  changed: {
    ticketLabel: {
      deletes: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketLabel = await ticketLabelsService.remove(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      id: input.id,
    });

    return {
      ticketLabel: {
        deletes: [ticketLabel],
      },
    };
  },
});
