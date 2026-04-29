import { tql } from '@/shared/lib/tql'

export const workspaceMembersQuery = tql.createQuery('workspaceMembers', {
  queryKey: 'workspaceMembers',
  query: (params: { workspaceId: string }) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    select: {
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
