import z from 'zod';

import { schema } from '../../schema';

export const notification = schema.model('notification', {
  schema: z.object({
    id: z.string(),
    userId: z.string(),
    data: z.record(z.string(), z.any()),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  fields: ({ field }) => ({
    id: field(),
    userId: field(),
    data: field(),
    createdAt: field(),
    updatedAt: field(),
  }),
  allowEach: ({ context, entity }) => {
    return context.user.id === entity.userId;
  },
  queries: ({ querySingle, queryMany }) => ({
    notifications: queryMany({
      query: z.object({
        order: z.enum(['asc', 'desc']),
        limit: z.number(),
      }),
      resolve: async ({ context, query }) => {
        return [];
      },
    }),
  }),
});
