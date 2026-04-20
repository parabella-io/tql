import { tql } from '@/shared/lib/tql'

type CreateWorkspaceParams = {
  name: string
}

export const createWorkspaceMutation = tql.createMutation('createWorkspace', {
  mutationKey: 'createWorkspace',
  mutation: (params: CreateWorkspaceParams) => ({
    name: params.name,
  }),
})
