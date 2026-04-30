import type { WorkspaceMembersInput } from '@tql/api'

import { tql } from '@/shared/lib/tql'

/** Matches server `withPaging.maxTakeSize` for workspaceMembers. */
export const WORKSPACE_MEMBERS_MAX_TAKE = 100

/** Default page size for members list UI. */
export const WORKSPACE_MEMBERS_PAGE_SIZE = 10

export type WorkspaceMembersQueryParams = { workspaceId: string } & Pick<WorkspaceMembersInput, 'pagingInfo'>

export const workspaceMembersQuery = tql.createQuery<'workspaceMembers', WorkspaceMembersInput, WorkspaceMembersQueryParams>(
  'workspaceMembers',
  {
    queryKey: 'workspaceMembers',
    query: (params: WorkspaceMembersQueryParams) => ({
      query: {
        workspaceId: params.workspaceId,
      },
      pagingInfo: params.pagingInfo,
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
  },
)
