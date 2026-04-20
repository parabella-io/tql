import { tql } from '@/shared/lib/tql'

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
})
