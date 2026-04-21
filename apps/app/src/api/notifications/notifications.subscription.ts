import { tql } from '@/shared/lib/tql'

export const notificationSubscription = tql.createSubscription(
  'notificationsSubscription',
  {
    subscriptionKey: 'notificationsSubscription',
    args() {
      return {}
    },
  },
)
