import { tql } from '@/shared/lib/tql'

import { myWorkspaceInvitesQuery } from '../queries/my-workspace-invites.query'
import { myWorkspacesQuery } from '../queries/my-workspaces.query'

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
    onSuccess: ({ store, output }) => {
      store.getAll(myWorkspacesQuery).update((draft) => {
        draft?.push(output.workspace)
      })

      store.getAll(myWorkspaceInvitesQuery).update((draft) => {
        const index = draft?.findIndex((invite) => invite.id === output.workspaceMemberInvite.id) ?? -1

        if (draft && index !== -1) {
          draft.splice(index, 1)
        }
      })
    },
  },
)
