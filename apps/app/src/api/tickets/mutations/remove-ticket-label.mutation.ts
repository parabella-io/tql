import { tql } from '@/shared/lib/tql'

import { ticketQuery } from '../queries/ticket.query'

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
    onSuccess: ({ store, output }) => {
      store
        .get(ticketQuery, { id: output.ticketLabel.ticketId })
        .update((draft) => {
          draft.labels = draft.labels.filter(
            (label) => label.id !== output.ticketLabel.id,
          )
        })
    },
  },
)
