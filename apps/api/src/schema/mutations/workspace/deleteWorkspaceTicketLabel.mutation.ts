import z from 'zod';

import { schema } from '../../schema';

import { workspaceTicketLabelService } from '../../../services';

export const deleteWorkspaceTicketLabel = schema.mutation('deleteWorkspaceTicketLabel', {
  input: z.object({
    workspaceId: z.string(),
    id: z.string(),
  }),

  changed: {
    workspaceTicketLabel: {
      deletes: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceTicketLabel = await workspaceTicketLabelService.delete(context.user, {
      workspaceId: input.workspaceId,
      id: input.id,
    });

    return {
      workspaceTicketLabel: {
        deletes: [workspaceTicketLabel],
      },
    };
  },
});
