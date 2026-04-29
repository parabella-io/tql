import { tql } from '@/shared/lib/tql'

export const workspaceMemberInvitesQuery = tql.createQuery(
  'workspaceMemberInvites',
  {
    queryKey: 'workspaceMemberInvites',
    query: (params: { workspaceId: string }) => ({
      query: {
        workspaceId: params.workspaceId,
      },
      select: {
        email: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  },
)

workspaceMemberInvitesQuery.updateOnChange('workspaceMemberInvite', {
  filter: ({ params, change }) => {
    return params.workspaceId === change.workspaceId
  },
  onInsert: ({ draft, change }) => {
    draft.push(change)
  },
  onUpdate: ({ draft, change }) => {
    const index = draft.findIndex((item) => item.id === change.id)

    if (index !== -1) {
      draft[index] = change
    }
  },
  onDelete: ({ draft, change }) => {
    const index = draft.findIndex((item) => item.id === change.id)

    if (index !== -1) {
      draft.splice(index, 1)
    }
  },
})
