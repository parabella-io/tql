import { tql } from '@/shared/lib/tql'

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
})
