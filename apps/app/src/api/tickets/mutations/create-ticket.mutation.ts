import { tql } from '@/shared/lib/tql'

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
})
