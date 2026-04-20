import { tql } from '@/shared/lib/tql'

type DeleteWorkspaceTicketLabelParams = {
  workspaceId: string
  id: string
}

export const deleteWorkspaceTicketLabelMutation = tql.createMutation(
  'deleteWorkspaceTicketLabel',
  {
    mutationKey: 'createWorkspaceTicketLabel',
    mutation: (params: DeleteWorkspaceTicketLabelParams) => ({
      workspaceId: params.workspaceId,
      id: params.id,
    }),
  },
)
