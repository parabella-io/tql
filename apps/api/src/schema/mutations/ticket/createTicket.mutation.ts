import z from 'zod';
import { v7 } from 'uuid';
import { ticketsService } from '../../../services';
import { schema } from '../../schema';
import { db } from '../../../database-client';

export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    ticketListId: z.string(),
    title: z.string().min(1),
  }),

  changed: {
    ticket: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, {
      workspaceId: input.workspaceId,
      ticketListId: input.ticketListId,
      title: input.title,
    });

    return {
      ticket: {
        inserts: [ticket],
      },
    };
  },

  resolveEffects: async ({ changes, emit }) => {
    const ticket = changes.ticket?.inserts?.[0];

    if (!ticket) return;

    const workspaceUsers = await db.workspaceMember.findMany({
      where: {
        workspaceId: ticket.workspaceId,
      },
      include: {
        user: true,
      },
    });

    const notifications = workspaceUsers.map((workspaceUser) => ({
      id: v7(),
      userId: workspaceUser.userId,
      data: {
        ticketId: ticket.id,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    emit({
      notification: {
        inserts: notifications,
      },
    });
  },
});
