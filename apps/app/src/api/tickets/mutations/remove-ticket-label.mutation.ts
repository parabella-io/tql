import { tql } from '@/shared/lib/tql'

type RemoveTicketLabelParams = {
  workspaceId: string
  ticketId: string
  id: string
}

export const removeTicketLabelMutation = tql.createMutation(
  'removeTicketLabel',
  {
    mutationKey: 'removeTicketLabel',
    mutation: (params: RemoveTicketLabelParams) => ({
      workspaceId: params.workspaceId,
      ticketId: params.ticketId,
      id: params.id,
    }),
  },
)
