import { tql } from '@/shared/lib/tql'

export const ticketListsQuery = tql.createQuery('ticketLists', {
  queryKey: 'ticketLists',
  query: (params: { workspaceId: string }) => ({
    query: {
      workspaceId: params.workspaceId,
      limit: 10,
      order: 'asc',
    },
    select: true,
    include: {
      tickets: {
        query: {
          limit: 10,
          order: 'asc',
        },
        select: true,
      },
    },
  }),
})

ticketListsQuery.updateOnChange('ticketList', {
  onInsert({ draft, change }) {
    if (draft) {
      draft.push({
        ...change,
        tickets: [],
      })
    }
  },
  onUpdate({ draft, change }) {
    if (draft) {
      const index = draft.findIndex((item) => item.id === change.id)

      if (index !== -1) {
        const existing = draft[index]!

        draft[index] = {
          ...existing,
          ...change,
        }
      }
    }
  },
  onDelete({ draft, change }) {
    if (draft) {
      const index = draft.findIndex((item) => item.id === change.id)

      if (index !== -1) {
        draft.splice(index, 1)
      }
    }
  },
})

ticketListsQuery.updateOnChange('ticket', {
  onInsert({ draft, change }) {
    if (!draft) return

    const listIndex = draft.findIndex((item) => item.id === change.ticketListId)

    if (listIndex !== -1) {
      draft[listIndex]!.tickets.push(change)
    }
  },
  onUpdate({ draft, change }) {
    if (!draft) return

    const listIndex = draft.findIndex((item) => item.id === change.ticketListId)

    if (listIndex === -1) return

    const ticketIndex = draft[listIndex]!.tickets.findIndex(
      (item) => item.id === change.id,
    )

    if (ticketIndex !== -1) {
      draft[listIndex]!.tickets[ticketIndex] = change
    }
  },
  onDelete() {},
})
