import { tql } from '@/shared/lib/tql'

import { workspaceTicketLabelsQuery } from '../queries/workspace-ticket-labels.query'

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
    onSuccess: ({ store, output }) => {
      store.getAll(workspaceTicketLabelsQuery).update((draft) => {
        const index = draft?.findIndex((label) => label.id === output.workspaceTicketLabel.id) ?? -1

        if (draft && index !== -1) {
          draft.splice(index, 1)
        }
      })
    },
  },
)
