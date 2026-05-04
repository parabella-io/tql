import { tql } from '@/shared/lib/tql'

import { ticketQuery } from '../queries/ticket.query'

type AssignTicketMemberParams = {
  workspaceId: string
  ticketId: string
  memberId: string
}

export const assignTicketMemberMutation = tql.createMutation(
  'assignTicketMember',
  {
    mutationKey: 'assignTicketMember',
    mutation: (params: AssignTicketMemberParams) => ({
      workspaceId: params.workspaceId,
      ticketId: params.ticketId,
      memberId: params.memberId,
    }),
    onSuccess: ({ store, output }) => {
      store
        .get(ticketQuery, { id: output.ticketAssignee.ticketId })
        .update((draft) => {
          draft.assignee = output.ticketAssignee
          draft.assigneeId = output.ticketAssignee.id
        })
    },
  },
)
