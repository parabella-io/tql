import { tql } from '@/shared/lib/tql'

import { workspaceMemberInvitesPagedQuery } from '../queries/workspace-member-invites.query'

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
      store.pagedAll(workspaceMemberInvitesPagedQuery).update((pages) => {
        for (const page of pages) {
          const index = page.data.findIndex((invite) => invite.id === output.workspaceMemberInvite.id)

          if (index !== -1) {
            page.data.splice(index, 1)
          }
        }
      })
    },
  },
)
