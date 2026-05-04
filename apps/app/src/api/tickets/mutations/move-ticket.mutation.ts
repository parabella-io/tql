import { tql } from '@/shared/lib/tql'

import { ticketListsQuery } from '../queries/ticket-lists.query'

type MoveTicketParams = {
  id: string
  oldTicketListId: string
  newTicketListId: string
}

export const moveTicketMutation = tql.createMutation('moveTicket', {
  mutationKey: 'moveTicket',
  mutation: (params: MoveTicketParams) => ({
    id: params.id,
    oldTicketListId: params.oldTicketListId,
    newTicketListId: params.newTicketListId,
  }),
  onOptimisticUpdate: ({ store, input }) => {
    const ticketLists = store.getAll(ticketListsQuery)

    ticketLists.update((draft) => {
      let movedTicket: any = null

      const oldList = draft!.find((list) => list.id === input.oldTicketListId)

      if (oldList) {
        const idx = oldList.tickets.findIndex((t) => t.id === input.id)

        if (idx !== -1) {
          movedTicket = oldList.tickets.splice(idx, 1)[0]
        }
      }

      if (movedTicket) {
        const newList = draft!.find((list) => list.id === input.newTicketListId)

        if (newList) {
          movedTicket.ticketListId = input.newTicketListId
          newList.tickets.push(movedTicket)
        }
      }
    })
  },
  onSuccess: ({ store, output }) => {
    store.getAll(ticketListsQuery).update((draft) => {
      for (const list of draft ?? []) {
        const ticketIndex = list.tickets.findIndex(
          (item) => item.id === output.ticket.id,
        )

        if (ticketIndex !== -1) {
          list.tickets[ticketIndex] = output.ticket
        }
      }
    })
  },
})
