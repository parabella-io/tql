import { tql } from '@/shared/lib/tql'

export const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: {
      id: params.id,
    },
    select: true,
    include: {
      assignee: {
        query: {},
        select: true,
      },
      reporter: {
        query: {},
        select: true,
      },
      attachments: {
        query: {
          order: 'asc',
        },
        select: true,
      },
      comments: {
        query: {
          order: 'asc',
        },
        select: true,
      },
      labels: {
        query: {
          order: 'asc',
        },
        select: true,
      },
    },
  }),
})

ticketQuery.updateOnChange('ticket', {
  filter: ({ params, change }) => {
    return params.id === change.id
  },
  onUpdate({ draft, change }) {
    draft.title = change.title
    draft.description = change.description
  },
})

ticketQuery.updateOnChange('ticketAttachment', {
  filter: ({ params, change }) => {
    return params.id === change.ticketId
  },
  onInsert({ draft, change }) {
    draft.attachments.push(change)
  },
  onDelete({ draft, change }) {
    draft.attachments = draft.attachments.filter((att) => att.id !== change.id)
  },
})

ticketQuery.updateOnChange('ticketAssignee', {
  filter: ({ params, change }) => {
    return params.id === change.ticketId
  },
  onInsert({ draft, change }) {
    draft.assignee = change
    draft.assigneeId = change.id
  },
  onDelete({ draft }) {
    draft.assigneeId = null
    draft.assignee = null
  },
})

ticketQuery.updateOnChange('ticketLabel', {
  filter: ({ params, change }) => {
    return params.id === change.ticketId
  },
  onInsert({ draft, change }) {
    draft.labels.push(change)
  },
  onDelete({ draft, change }) {
    draft.labels = draft.labels.filter((label) => label.id !== change.id)
  },
})
