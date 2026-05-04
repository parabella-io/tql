import { tql } from '@/shared/lib/tql'

import { ticketQuery } from '../queries/ticket.query'

type AddTicketLabelParams = {
  workspaceId: string
  ticketId: string
  labelId: string
}

export const addTicketLabelMutation = tql.createMutation('addTicketLabel', {
  mutationKey: 'addTicketLabel',
  mutation: (params: AddTicketLabelParams) => ({
    workspaceId: params.workspaceId,
    ticketId: params.ticketId,
    labelId: params.labelId,
  }),
  onSuccess: ({ store, output }) => {
    store
      .get(ticketQuery, { id: output.ticketLabel.ticketId })
      .update((draft) => {
        draft.labels.push(output.ticketLabel)
      })
  },
})
