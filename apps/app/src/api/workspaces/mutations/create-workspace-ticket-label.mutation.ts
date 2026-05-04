import { tql } from '@/shared/lib/tql'

import { workspaceTicketLabelsQuery } from '../queries/workspace-ticket-labels.query'

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
    onSuccess: ({ store, output }) => {
      store.getAll(workspaceTicketLabelsQuery).update((draft) => {
        draft?.push(output.workspaceTicketLabel)
      })
    },
  },
)
