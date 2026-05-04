import { tql } from '@/shared/lib/tql'

import { ticketQuery } from '../queries/ticket.query'

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
    onSuccess: ({ store, output }) => {
      store
        .get(ticketQuery, { id: output.ticketAttachment.ticketId })
        .update((draft) => {
          draft.attachments = draft.attachments.filter(
            (attachment) => attachment.id !== output.ticketAttachment.id,
          )
        })
    },
  },
)
