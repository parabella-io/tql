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
  filter: ({ params, change }) => {
    return params.workspaceId === change.workspaceId
  },
  onInsert({ draft, change }) {
    draft.push(change)
  },
})
