import { tql } from '@/shared/lib/tql'

import { ticketListsQuery } from '../queries/ticket-lists.query'

type UpdateTicketListParams = {
  id: string
  name: string
}

export const updateTicketListMutation = tql.createMutation('updateTicketList', {
  mutationKey: 'updateTicketList',
  mutation: (params: UpdateTicketListParams) => ({
    id: params.id,
    name: params.name,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(ticketListsQuery).update((draft) => {
      const index =
        draft?.findIndex((item) => item.id === output.ticketList.id) ?? -1

      if (draft && index !== -1) {
        draft[index] = {
          ...draft[index]!,
          ...output.ticketList,
        }
      }
    })
  },
})
