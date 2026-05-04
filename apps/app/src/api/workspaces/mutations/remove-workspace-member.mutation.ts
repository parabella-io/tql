import { tql } from '@/shared/lib/tql'

import { workspaceMembersQuery } from '../queries/workspace-members.query'

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
    onSuccess: ({ store, output }) => {
      store.getAll(workspaceMembersQuery).update((draft) => {
        const index = draft?.findIndex((member) => member.id === output.workspaceMember.id) ?? -1

        if (draft && index !== -1) {
          draft.splice(index, 1)
        }
      })
    },
  },
)
