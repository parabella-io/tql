import { z } from 'zod';

import { schema } from '../../schema';

import { workspaceTicketLabelService } from '../../../services';

export const workspaceTicketLabel = schema.model('workspaceTicketLabel', {
  schema: z.object({
    id: z.string(),
    name: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    name: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    workspaceTicketLabelById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return workspaceTicketLabelService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    workspaceTicketLabels: queryMany({
      query: z.object({
        workspaceId: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return workspaceTicketLabelService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
        });
      },
    }),
  }),
});
