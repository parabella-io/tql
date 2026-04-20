import { tql } from '@/shared/lib/tql'

type UpdateUserMutationParams = {
  id: string
  name: string
}

export const updateUserMutation = tql.createMutation('updateUser', {
  mutationKey: 'updateUser',
  mutation: (params: UpdateUserMutationParams) => ({
    userId: params.id,
    name: params.name,
  }),
})
