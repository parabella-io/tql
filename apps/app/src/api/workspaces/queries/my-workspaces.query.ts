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
