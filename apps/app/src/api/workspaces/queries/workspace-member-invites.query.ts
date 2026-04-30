import type { WorkspaceMemberInvitesInput } from '@tql/api'

import { tql } from '@/shared/lib/tql'

export const WORKSPACE_MEMBER_INVITES_PAGE_SIZE = 10

export type WorkspaceMemberInvitesQueryParams = { workspaceId: string } & Pick<
  WorkspaceMemberInvitesInput,
  'pagingInfo'
>

export const workspaceMemberInvitesQuery = tql.createQuery<
  'workspaceMemberInvites',
  WorkspaceMemberInvitesInput,
  WorkspaceMemberInvitesQueryParams
>('workspaceMemberInvites', {
  queryKey: 'workspaceMemberInvites',
  query: (params: WorkspaceMemberInvitesQueryParams) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    pagingInfo: params.pagingInfo,
    select: {
      id: true,
      email: true,
      workspaceId: true,
      createdAt: true,
      updatedAt: true,
    },
  }),
})
