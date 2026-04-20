import { tql } from '@/shared/lib/tql'

type CreateWorkspaceTicketLabelParams = {
  workspaceId: string
  name: string
}

export const createWorkspaceTicketLabelMutation = tql.createMutation(
  'createWorkspaceTicketLabel',
  {
    mutationKey: 'createWorkspaceTicketLabel',
    mutation: (params: CreateWorkspaceTicketLabelParams) => ({
      workspaceId: params.workspaceId,
      name: params.name,
    }),
  },
)
