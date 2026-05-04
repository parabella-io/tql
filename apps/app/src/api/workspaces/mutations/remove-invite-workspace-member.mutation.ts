import { tql } from '@/shared/lib/tql'

import { workspaceMemberInvitesQuery } from '../queries/workspace-member-invites.query'

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
    onSuccess: ({ store, output }) => {
      store.getAll(workspaceMemberInvitesQuery).update((draft) => {
        const index = draft?.findIndex((invite) => invite.id === output.workspaceMemberInvite.id) ?? -1

        if (draft && index !== -1) {
          draft.splice(index, 1)
        }
      })
    },
  },
)
