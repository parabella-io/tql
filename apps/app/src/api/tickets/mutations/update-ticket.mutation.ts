import { tql } from '@/shared/lib/tql'

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
})
