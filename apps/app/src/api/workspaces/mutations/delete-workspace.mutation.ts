import { tql } from '@/shared/lib/tql'

import { myWorkspacesQuery } from '../queries/my-workspaces.query'

type DeleteWorkspaceMutationParams = {
  id: string
}

export const deleteWorkspaceMutation = tql.createMutation('deleteWorkspace', {
  mutationKey: 'deleteWorkspace',
  mutation: (params: DeleteWorkspaceMutationParams) => ({
    id: params.id,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(myWorkspacesQuery).update((draft) => {
      const index = draft?.findIndex((item) => item.id === output.workspace.id) ?? -1

      if (draft && index !== -1) {
        draft.splice(index, 1)
      }
    })
  },
})
