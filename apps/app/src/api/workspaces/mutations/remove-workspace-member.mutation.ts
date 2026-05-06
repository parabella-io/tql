import { tql } from '@/shared/lib/tql'

import { workspaceMembersPagedQuery } from '../queries/workspace-members.query'

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
      store.pagedAll(workspaceMembersPagedQuery).update((pages) => {
        for (const page of pages) {
          const index = page.data.findIndex((member) => member.id === output.workspaceMember.id)

          if (index !== -1) {
            page.data.splice(index, 1)
          }
        }
      })
    },
  },
)
