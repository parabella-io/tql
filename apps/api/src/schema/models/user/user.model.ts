import { z } from 'zod';

import { schema } from '../../schema';

import { userService } from '../../../services';

export const user = schema.model('user', {
  schema: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    name: field(),
    email: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.id === entity.id;
  },

  queries: ({ querySingle }) => ({
    userById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return userService.getById(query.id);
      },
    }),
  }),

  includes: ({ includeSingle, includeMany }) => ({}),
});
