import { tql } from '@/shared/lib/tql'

import { ticketQuery } from '../queries/ticket.query'

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
    onSuccess: ({ store, output }) => {
      store
        .get(ticketQuery, { id: output.ticketAttachment.ticketId })
        .update((draft) => {
          draft.attachments.push(output.ticketAttachment)
        })
    },
  },
)
