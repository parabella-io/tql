import { tql } from '@/shared/lib/tql'

export const workspaceMembersQuery = tql.createQuery('workspaceMembers', {
  queryKey: 'workspaceMembers',
  query: (params: { workspaceId: string }) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    select: true,
  }),
})
