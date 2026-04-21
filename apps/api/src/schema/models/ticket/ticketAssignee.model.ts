import { z } from 'zod';

import { schema } from '../../schema';

import { ticketAssigneeService } from '../../../services';

export const ticketAssignee = schema.model('ticketAssignee', {
  schema: z.object({
    id: z.string(),
    ticketId: z.string(),
    userId: z.string(),
    name: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    ticketId: field(),
    userId: field(),
    name: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle }) => ({
    ticketAssigneeById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return ticketAssigneeService.getById(context.user, {
          id: query.id,
        });
      },
    }),
  }),
});
