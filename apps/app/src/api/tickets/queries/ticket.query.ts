import { tql } from '@/shared/lib/tql'

export const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: {
      id: params.id,
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
    include: {
      assignee: {
        query: {},
        select: {
          ticketId: true,
          userId: true,
          name: true,
          workspaceId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      reporter: {
        query: {},
        select: {
          ticketId: true,
          userId: true,
          name: true,
          workspaceId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      attachments: {
        query: {
          order: 'asc',
        },
        select: {
          ticketId: true,
          key: true,
          name: true,
          size: true,
          workspaceId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      comments: {
        query: {
          order: 'asc',
        },
        select: {
          content: true,
          ticketId: true,
          workspaceId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      labels: {
        query: {
          order: 'asc',
        },
        select: {
          name: true,
          workspaceTicketLabelId: true,
          ticketId: true,
          workspaceId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  }),
})
