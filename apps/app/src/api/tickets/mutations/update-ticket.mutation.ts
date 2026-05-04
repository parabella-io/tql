import { tql } from '@/shared/lib/tql'

import { ticketQuery } from '../queries/ticket.query'
import { ticketListsQuery } from '../queries/ticket-lists.query'

type UpdateTicketParams = {
  id: string
  title: string
  description: string
}

export const updateTicketMutation = tql.createMutation('updateTicket', {
  mutationKey: 'updateTicket',
  mutation: (params: UpdateTicketParams) => ({
    id: params.id,
    title: params.title,
    description: params.description,
  }),
  onSuccess: ({ store, output }) => {
    store.get(ticketQuery, { id: output.ticket.id }).update((draft) => {
      draft.title = output.ticket.title
      draft.description = output.ticket.description
    })

    store.getAll(ticketListsQuery).update((draft) => {
      const list = draft.find((item) => item.id === output.ticket.ticketListId)

      const ticketIndex = list?.tickets.findIndex(
        (item) => item.id === output.ticket.id,
      )

      if (list && ticketIndex !== -1) {
        list.tickets[ticketIndex!] = output.ticket
      }
    })
  },
})
