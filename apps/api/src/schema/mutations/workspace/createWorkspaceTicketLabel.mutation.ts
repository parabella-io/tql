import z from 'zod';

import { schema } from '../../schema';

import { workspaceTicketLabelService } from '../../../services';

export const createWorkspaceTicketLabel = schema.mutation('createWorkspaceTicketLabel', {
  input: z.object({
    workspaceId: z.string(),
    name: z.string().min(1),
  }),

  changed: {
    workspaceTicketLabel: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const workspaceTicketLabel = await workspaceTicketLabelService.create(context.user, {
      workspaceId: input.workspaceId,
      name: input.name,
    });

    return {
      workspaceTicketLabel: {
        inserts: [workspaceTicketLabel],
      },
    };
  },
});
