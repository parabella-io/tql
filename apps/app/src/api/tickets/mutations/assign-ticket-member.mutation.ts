import { tql } from '@/shared/lib/tql'

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
  },
)
