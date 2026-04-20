import { tql } from '@/shared/lib/tql'

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
})
