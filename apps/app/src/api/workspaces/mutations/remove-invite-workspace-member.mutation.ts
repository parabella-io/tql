import { tql } from '@/shared/lib/tql'

type RemoveInviteWorkspaceMemberParams = {
  workspaceId: string
  inviteId: string
}

export const removeInviteWorkspaceMemberMutation = tql.createMutation(
  'removeInviteWorkspaceMember',
  {
    mutationKey: 'removeInviteWorkspaceMember',
    mutation: (params: RemoveInviteWorkspaceMemberParams) => ({
      workspaceId: params.workspaceId,
      inviteId: params.inviteId,
    }),
  },
)
