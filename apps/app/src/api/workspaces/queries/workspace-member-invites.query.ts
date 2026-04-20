import { tql } from '@/shared/lib/tql'

export const workspaceMemberInvitesQuery = tql.createQuery(
  'workspaceMemberInvites',
  {
    queryKey: 'workspaceMemberInvites',
    query: (params: { workspaceId: string }) => ({
      query: {
        workspaceId: params.workspaceId,
      },
      select: true,
    }),
  },
)

workspaceMemberInvitesQuery.updateOnChange('workspaceMemberInvite', {
  onInsert: ({ draft, params, change }) => {
    if (!draft || params.workspaceId !== change.workspaceId) return
    draft.push(change)
  },
  onUpdate: ({ draft, params, change }) => {
    if (!draft || params.workspaceId !== change.workspaceId) return
    const index = draft.findIndex((item) => item.id === change.id)
    if (index !== -1) {
      draft[index] = change
    }
  },
  onDelete: ({ draft, params, change }) => {
    if (!draft || params.workspaceId !== change.workspaceId) return
    const index = draft.findIndex((item) => item.id === change.id)
    if (index !== -1) {
      draft.splice(index, 1)
    }
  },
})
