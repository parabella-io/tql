import { tql } from '@/shared/lib/tql'

type WorkspaceTicketLabelsParams = {
  workspaceId: string
}

export const workspaceTicketLabelsQuery = tql.createQuery(
  'workspaceTicketLabels',
  {
    queryKey: 'workspaceTicketLabels',
    query: (params: WorkspaceTicketLabelsParams) => ({
      query: {
        workspaceId: params.workspaceId,
      },
      select: true,
    }),
  },
)

workspaceTicketLabelsQuery.updateOnChange('workspaceTicketLabel', {
  onInsert({ draft, params, change }) {
    if (!draft || params.workspaceId !== change.workspaceId) return
    draft.push(change)
  },
  onUpdate({ draft, params, change }) {
    if (!draft || params.workspaceId !== change.workspaceId) return
  },
  onDelete({ draft, params, change }) {
    if (!draft || params.workspaceId !== change.workspaceId) return
  },
})
