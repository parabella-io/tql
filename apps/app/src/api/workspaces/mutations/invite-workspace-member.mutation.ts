import { tql } from '@/shared/lib/tql'

type InviteWorkspaceMemberParams = {
  workspaceId: string
  email: string
}

export const inviteWorkspaceMemberMutation = tql.createMutation(
  'inviteWorkspaceMember',
  {
    mutationKey: 'inviteWorkspaceMember',
    mutation: (params: InviteWorkspaceMemberParams) => ({
      workspaceId: params.workspaceId,
      email: params.email,
    }),
  },
)
