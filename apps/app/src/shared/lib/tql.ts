import { Client } from '@tql/client'

import { axios } from './axios'

import type { ClientSchema } from '@tql/api'

export const tql = new Client<ClientSchema>({
  handleQuery: async (query) => {
    const response = await axios.post('/query', query)

    return response.data
  },
  handleMutation: async (mutation) => {
    const response = await axios.post('/mutation', mutation)

    return response.data
  },
})
