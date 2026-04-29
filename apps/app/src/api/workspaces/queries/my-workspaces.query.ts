import { tql } from '@/shared/lib/tql'

export const myWorkspacesQuery = tql.createQuery('myWorkspaces', {
  queryKey: 'myWorkspaces',
  query: () => ({
    query: {},
    select: {
      name: true,
    },
  }),
})

/**
 *  Listen to changes to organisation entities, and update the myOrganisationsQuery with the changes.
 */
myWorkspacesQuery.updateOnChange('workspace', {
  onInsert({ draft, change }) {
    draft.push(change)
  },
  onUpdate({ draft, change }) {
    const index = draft.findIndex((item) => item.id === change.id)

    if (index !== -1) {
      draft[index] = {
        ...draft[index],
        ...change,
      }
    }
  },
  onDelete({ draft, change }) {
    const index = draft.findIndex((item) => item.id === change.id)

    if (index !== -1) {
      draft.splice(index, 1)
    }
  },
})
