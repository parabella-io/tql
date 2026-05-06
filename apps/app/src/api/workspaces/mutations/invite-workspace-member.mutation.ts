import { tql } from '@/shared/lib/tql'

import { workspaceMemberInvitesPagedQuery } from '../queries/workspace-member-invites.query'

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
    onSuccess: ({ store, output }) => {
      store.pagedAll(workspaceMemberInvitesPagedQuery).addToEnd(output.workspaceMemberInvite)
    },
  },
)
