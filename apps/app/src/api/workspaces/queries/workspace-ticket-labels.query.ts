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
      select: {
        name: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  },
)
