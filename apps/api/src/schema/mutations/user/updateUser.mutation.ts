import z from 'zod';

import { schema } from '../../schema';

export const updateUser = schema.mutation('updateUser', {
  input: z.object({
    userId: z.string(),
    name: z.string(),
  }),

  changed: {
    user: {
      updates: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.id === input.userId;
  },

  resolve: async ({ context, input }) => {
    const user = await context.userService.update(context.user, {
      userId: input.userId,
      name: input.name,
    });

    return {
      user: {
        updates: [user],
      },
    };
  },
});
