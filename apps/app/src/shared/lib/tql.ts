import { Client, HttpTransport } from '@parabella-io/tql-client'

import type { ClientSchema } from '@tql/api'

export const tql = new Client<ClientSchema>({
  transports: {
    http: new HttpTransport({
      url: 'http://localhost:3001',
      withCredentials: true,
    }),
  },
})
