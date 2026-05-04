import { tql } from '@/shared/lib/tql'

import { myWorkspaceInvitesQuery } from '../queries/my-workspace-invites.query'

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
    onSuccess: ({ store, output }) => {
      store.getAll(myWorkspaceInvitesQuery).update((draft) => {
        const index = draft?.findIndex((invite) => invite.id === output.workspaceMemberInvite.id) ?? -1

        if (draft && index !== -1) {
          draft.splice(index, 1)
        }
      })
    },
  },
)
