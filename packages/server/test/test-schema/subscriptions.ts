import { z } from 'zod';

import { schema } from './schema.js';

export const postSubscription = schema.subscription('postSubscription', {
  args: z.object({
    postId: z.string(),
  }),
  subscribeTo: {
    post: true,
  },
  allow: async ({ context }) => {
    return context.isAuthenticated;
  },
  keyFromSubscribe: ({ args }) => args.postId,
  keyFromChange: ({ change }) => {
    return change.row.id;
  },
  filter: ({ args, change }) => {
    return change.row.id === args.postId;
  },
});

export const commentSubscription = schema.subscription('commentSubscription', {
  args: z.object({
    postId: z.string(),
  }),
  subscribeTo: {
    comment: true,
  },
  keyFromSubscribe: ({ args }) => args.postId,
  keyFromChange: ({ change }) => {
    return change.row.postId;
  },
});
