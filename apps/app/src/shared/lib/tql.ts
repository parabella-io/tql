import { Client } from '@tql/client'

import type { ClientSchema } from '@tql/api'

const port = 3001

export const tql = new Client<ClientSchema>({
  transports: {
    http: {
      url: `http://localhost:${port}`,
    },
    sse: {
      eventsUrl: `http://localhost:${port}/events`,
      subscribeUrl: `http://localhost:${port}/subscribe`,
      unsubscribeUrl: `http://localhost:${port}/unsubscribe`,
    },
  },
  subscriptionTransport: 'sse',
})
