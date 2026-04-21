import z from 'zod';

import { schema } from '../schema';

export const notificationsSubscription = schema.subscription('notificationsSubscription', {
  args: z.object({}),
  subscribeTo: {
    notification: true,
  },
  allow: async ({ context }) => !!context.user.id,
  keyFromSubscribe: ({ connection }) => connection.user.id,
  keyFromChange: ({ change }) => change.row.userId,
});
