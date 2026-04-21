import { Client } from '@tql/client'

import type { ClientSchema } from '@tql/api'

const port = 3001

const wsPort = 3002

export const tql = new Client<ClientSchema>({
  transports: {
    http: {
      url: `http://localhost:${port}`,
      withCredentials: true,
    },
    sse: {
      url: `http://localhost:${port}`,
      withCredentials: true,
    },
    ws: {
      url: `ws://localhost:${wsPort}`,
      withCredentials: true,
    },
  },
  subscriptionTransport: 'ws',
})
