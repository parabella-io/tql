import { tql } from '@/shared/lib/tql'

import { ticketListsQuery } from '../queries/ticket-lists.query'

type CreateTicketListParams = {
  workspaceId: string
  name: string
}

export const createTicketListMutation = tql.createMutation('createTicketList', {
  mutationKey: 'createTicketList',
  mutation: (params: CreateTicketListParams) => ({
    workspaceId: params.workspaceId,
    name: params.name,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(ticketListsQuery).update((draft) => {
      draft.push({
        ...output.ticketList,
        tickets: [],
      })
    })
  },
})
