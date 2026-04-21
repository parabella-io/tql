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
  onInsert() {},
  onUpdate({ draft, change }) {
    if (!draft || draft.id !== change.id) return
    draft.title = change.title
    draft.description = change.description
  },
  onDelete() {},
})

ticketQuery.updateOnChange('ticketAttachment', {
  onInsert({ draft, change }) {
    if (!draft || draft.id !== change.ticketId) return
    draft.attachments.push(change)
  },
  onDelete({ draft, change }) {
    if (!draft) return
    draft.attachments = draft.attachments.filter((att) => att.id !== change.id)
  },
})

ticketQuery.updateOnChange('ticketAssignee', {
  onInsert({ draft, change }) {
    if (!draft || draft.id !== change.ticketId) return
    draft.assignee = change
    draft.assigneeId = change.id
  },
  onUpdate() {},
  onDelete({ draft, change }) {
    if (!draft || draft.id !== change.ticketId) return
    draft.assigneeId = null
    draft.assignee = null
  },
})

ticketQuery.updateOnChange('ticketLabel', {
  onInsert({ draft, change }) {
    if (!draft || draft.id !== change.ticketId) return
    draft.labels.push(change)
  },
  onUpdate() {},
  onDelete({ draft, change }) {
    console.log('change', change)
    if (!draft || draft.id !== change.ticketId) return
    draft.labels = draft.labels.filter((label) => label.id !== change.id)
  },
})
