import { z } from 'zod';
import { schema } from '../../schema';
import { ticketReporterService } from '../../../services';

export const ticketReporter = schema.model('ticketReporter', {
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
    ticketReporterById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return ticketReporterService.getById(context.user, {
          id: query.id,
        });
      },
    }),
  }),
});
