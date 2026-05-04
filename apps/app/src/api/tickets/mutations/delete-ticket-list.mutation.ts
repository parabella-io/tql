import { tql } from '@/shared/lib/tql'

import { ticketListsQuery } from '../queries/ticket-lists.query'

type DeleteTicketListParams = {
  id: string
}

export const deleteTicketListMutation = tql.createMutation('deleteTicketList', {
  mutationKey: 'deleteTicketList',
  mutation: (params: DeleteTicketListParams) => ({
    id: params.id,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(ticketListsQuery).update((draft) => {
      const index = draft.findIndex((item) => item.id === output.ticketList.id)

      if (draft && index !== -1) {
        draft.splice(index, 1)
      }
    })
  },
})
