import { tql } from '@/shared/lib/tql'

type DeleteTicketListParams = {
  id: string
}

export const deleteTicketListMutation = tql.createMutation('deleteTicketList', {
  mutationKey: 'deleteTicketList',
  mutation: (params: DeleteTicketListParams) => ({
    id: params.id,
  }),
})
