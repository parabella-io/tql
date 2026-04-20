import { tql } from '@/shared/lib/tql'

type DeleteWorkspaceMutationParams = {
  id: string
}

export const deleteWorkspaceMutation = tql.createMutation('deleteWorkspace', {
  mutationKey: 'deleteWorkspace',
  mutation: (params: DeleteWorkspaceMutationParams) => ({
    id: params.id,
  }),
})
