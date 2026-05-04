import z from 'zod';

import { userOutputSchema } from '../outputSchemas';
import { schema } from '../../schema';

export const updateUser = schema.mutation('updateUser', {
  input: z.object({
    userId: z.string(),
    name: z.string(),
  }),

  output: z.object({
    user: userOutputSchema,
  }),

  allow: ({ context, input }) => {
    return context.user.id === input.userId;
  },

  resolve: async ({ context, input }) => {
    const user = await context.userService.update(context.user, {
      userId: input.userId,
      name: input.name,
    });

    return {
      user,
    };
  },
});
