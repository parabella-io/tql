import { tql } from '@/shared/lib/tql'

export const myWorkspaceInvitesQuery = tql.createQuery('myWorkspaceInvites', {
  queryKey: 'myWorkspaceInvites',
  query: () => ({
    query: {},
    select: true,
    include: {
      workspace: {
        query: {},
        select: true,
        include: {
          owner: {
            query: {},
            select: true,
          },
        },
      },
    },
  }),
})

myWorkspaceInvitesQuery.updateOnChange('workspaceMemberInvite', {
  onInsert: ({}) => {},
  onUpdate: ({}) => {},
  onDelete: ({ draft, change }) => {
    const index = draft.findIndex((item) => item.id === change.id)

    if (index !== -1) {
      draft.splice(index, 1)
    }
  },
})
