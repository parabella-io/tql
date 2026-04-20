import { tql } from '@/shared/lib/tql'

type CreateTicketAttachmentParams = {
  workspaceId: string
  ticketId: string
  name: string
  size: number
  key: string
}

export const createTicketAttachmentMutation = tql.createMutation(
  'createTicketAttachment',
  {
    mutationKey: 'createTicketAttachment',
    mutation: (params: CreateTicketAttachmentParams) => ({
      workspaceId: params.workspaceId,
      ticketId: params.ticketId,
      name: params.name,
      size: params.size,
      key: params.key,
    }),
  },
)
