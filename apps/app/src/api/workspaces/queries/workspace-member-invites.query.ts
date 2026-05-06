import type { WorkspaceMemberInvitesInput } from '@tql/api'

import { tql } from '@/shared/lib/tql'

export type WorkspaceMemberInvitesQueryParams = { workspaceId: string }

export const workspaceMemberInvitesPagedQuery = tql.createPagedQuery<
  'workspaceMemberInvites',
  WorkspaceMemberInvitesInput,
  WorkspaceMemberInvitesQueryParams
>('workspaceMemberInvites', {
  queryKey: 'workspaceMemberInvites',
  pageSize: 10,
  query: (params: WorkspaceMemberInvitesQueryParams, pagingInfo) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    pagingInfo,
    select: {
      id: true,
      email: true,
      workspaceId: true,
      createdAt: true,
      updatedAt: true,
    },
  }),
})
