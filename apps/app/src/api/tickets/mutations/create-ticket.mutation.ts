import { tql } from '@/shared/lib/tql'

import { ticketListsQuery } from '../queries/ticket-lists.query'

type CreateTicketParams = {
  workspaceId: string
  ticketListId: string
  title: string
}

export const createTicketMutation = tql.createMutation('createTicket', {
  mutationKey: 'createTicket',
  mutation: (params: CreateTicketParams) => ({
    workspaceId: params.workspaceId,
    ticketListId: params.ticketListId,
    title: params.title,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(ticketListsQuery).update((draft) => {
      const list = draft.find((item) => item.id === output.ticket.ticketListId)
      list?.tickets.push(output.ticket)
    })
  },
})
