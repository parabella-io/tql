import { tql } from '@/shared/lib/tql'

export const ticketListsQuery = tql.createQuery('ticketLists', {
  queryKey: 'ticketLists',
  query: (params: { workspaceId: string }) => ({
    query: {
      workspaceId: params.workspaceId,
      limit: 10,
      order: 'asc',
    },
    select: {
      name: true,
      workspaceId: true,
      createdAt: true,
      updatedAt: true,
    },
    include: {
      tickets: {
        query: {
          limit: 10,
          order: 'asc',
        },
        select: {
          title: true,
          description: true,
          workspaceId: true,
          ticketListId: true,
          assigneeId: true,
          reporterId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  }),
})
