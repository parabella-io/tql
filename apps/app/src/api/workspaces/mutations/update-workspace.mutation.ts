import { tql } from '@/shared/lib/tql'

import { myWorkspacesQuery } from '../queries/my-workspaces.query'

type UpdateWorkspaceMutationParams = {
  id: string
  name: string
}

export const updateWorkspaceMutation = tql.createMutation('updateWorkspace', {
  mutationKey: 'updateWorkspace',
  mutation: (params: UpdateWorkspaceMutationParams) => ({
    workspaceId: params.id,
    name: params.name,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(myWorkspacesQuery).update((draft) => {
      const index = draft?.findIndex((item) => item.id === output.workspace.id) ?? -1

      if (draft && index !== -1) {
        draft[index] = {
          ...draft[index]!,
          ...output.workspace,
        }
      }
    })
  },
})
