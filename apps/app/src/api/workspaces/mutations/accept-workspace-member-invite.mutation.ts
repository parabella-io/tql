import { tql } from '@/shared/lib/tql'

type AcceptWorkspaceMemberInviteMutationParams = {
  workspaceId: string
  inviteId: string
}

export const acceptWorkspaceMemberInviteMutation = tql.createMutation(
  'acceptWorkspaceMemberInvite',
  {
    mutationKey: 'acceptWorkspaceMemberInvite',
    mutation: (params: AcceptWorkspaceMemberInviteMutationParams) => ({
      workspaceId: params.workspaceId,
      inviteId: params.inviteId,
    }),
  },
)
