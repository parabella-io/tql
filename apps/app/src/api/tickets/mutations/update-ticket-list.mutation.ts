import { tql } from '@/shared/lib/tql'

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
})
