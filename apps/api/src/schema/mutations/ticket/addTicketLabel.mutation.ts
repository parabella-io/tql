import z from 'zod';

import { schema } from '../../schema';

export const addTicketLabel = schema.mutation('addTicketLabel', {
  input: z.object({
    workspaceId: z.string(),
    ticketId: z.string(),
    labelId: z.string(),
  }),

  changed: {
    ticketLabel: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticketLabel = await context.ticketLabelsService.add(context.user, {
      workspaceId: input.workspaceId,
      ticketId: input.ticketId,
      labelId: input.labelId,
    });

    return {
      ticketLabel: {
        inserts: [ticketLabel],
      },
    };
  },

  resolveEffects: async ({ context, changes, input }) => {},
});
