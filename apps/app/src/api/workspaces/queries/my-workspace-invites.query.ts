import { tql } from '@/shared/lib/tql'

export const myWorkspaceInvitesQuery = tql.createQuery('myWorkspaceInvites', {
  queryKey: 'myWorkspaceInvites',
  query: () => ({
    query: {},
    select: {
      email: true,
      workspaceId: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      workspace: {
        query: {},
        select: {
          name: true,
        },
        include: {
          owner: {
            query: {},
            select: {
              userId: true,
              name: true,
              email: true,
              workspaceId: true,
              isWorkspaceOwner: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  }),
})
