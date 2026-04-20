import { tql } from '@/shared/lib/tql'

type DeclineWorkspaceMemberInviteMutationParams = {
  workspaceId: string
  inviteId: string
}

export const declineWorkspaceMemberInviteMutation = tql.createMutation(
  'declineWorkspaceMemberInvite',
  {
    mutationKey: 'declineWorkspaceMemberInvite',
    mutation: (params: DeclineWorkspaceMemberInviteMutationParams) => ({
      workspaceId: params.workspaceId,
      inviteId: params.inviteId,
    }),
  },
)
