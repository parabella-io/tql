import { tql } from '@/shared/lib/tql'

type RemoveWorkspaceMemberParams = {
  workspaceId: string
  memberId: string
}

export const removeWorkspaceMemberMutation = tql.createMutation(
  'removeWorkspaceMember',
  {
    mutationKey: 'removeInviteWorkspaceMember',
    mutation: (params: RemoveWorkspaceMemberParams) => ({
      workspaceId: params.workspaceId,
      memberId: params.memberId,
    }),
  },
)
