import { tql } from '@/shared/lib/tql'

import { myWorkspacesQuery } from '../queries/my-workspaces.query'

type CreateWorkspaceParams = {
  name: string
}

export const createWorkspaceMutation = tql.createMutation('createWorkspace', {
  mutationKey: 'createWorkspace',
  mutation: (params: CreateWorkspaceParams) => ({
    name: params.name,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(myWorkspacesQuery).update((draft) => {
      draft?.push(output.workspace)
    })
  },
})
