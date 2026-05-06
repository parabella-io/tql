import type { WorkspaceMembersInput } from '@tql/api'

import { tql } from '@/shared/lib/tql'

export type WorkspaceMembersQueryParams = { workspaceId: string }

export const workspaceMembersPagedQuery = tql.createPagedQuery<
  'workspaceMembers',
  WorkspaceMembersInput,
  WorkspaceMembersQueryParams
>('workspaceMembers', {
  queryKey: 'workspaceMembers',
  pageSize: 10,
  query: (params: WorkspaceMembersQueryParams, pagingInfo) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    pagingInfo,
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      workspaceId: true,
      isWorkspaceOwner: true,
      createdAt: true,
      updatedAt: true,
    },
  }),
})

export const workspaceMembersMaxPagedQuery = tql.createPagedQuery<
  'workspaceMembers',
  WorkspaceMembersInput,
  WorkspaceMembersQueryParams
>('workspaceMembers', {
  queryKey: 'workspaceMembersMax',
  pageSize: 100,
  query: (params: WorkspaceMembersQueryParams, pagingInfo) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    pagingInfo,
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      workspaceId: true,
      isWorkspaceOwner: true,
      createdAt: true,
      updatedAt: true,
    },
  }),
})
