import { tql } from '@/shared/lib/tql'

type DeleteTicketAttachmentParams = {
  workspaceId: string
  ticketId: string
  attachmentId: string
}

export const deleteTicketAttachmentMutation = tql.createMutation(
  'deleteTicketAttachment',
  {
    mutationKey: 'deleteTicketAttachment',
    mutation: (params: DeleteTicketAttachmentParams) => ({
      workspaceId: params.workspaceId,
      ticketId: params.ticketId,
      attachmentId: params.attachmentId,
    }),
  },
)
