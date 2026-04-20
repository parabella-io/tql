import { v7 } from 'uuid';
import { PrismaClient, TicketAttachment } from '../../database';
import { TicketAttachmentEntity, UserContext } from '../../schema/schema';

type CreateTicketAttachmentArgs = {
  workspaceId: string;
  ticketId: string;
  name: string;
  size: number;
  key: string;
};

type DeleteTicketAttachmentArgs = {
  id: string;
  workspaceId: string;
  ticketId: string;
};

type GetTicketAttachmentByIdArgs = {
  id: string;
};

type QueryTicketAttachmentsByTicketId = {
  ticketId: string;
  order: 'asc' | 'desc';
};

type QueryTicketAttachmentsByTicketIds = {
  ticketIds: string[];
  order: 'asc' | 'desc';
};

export class TicketAttachmentsService {
  constructor(private readonly db: PrismaClient) {}

  async create(user: UserContext, args: CreateTicketAttachmentArgs): Promise<TicketAttachmentEntity> {
    const { workspaceId, ticketId, name, size, key } = args;

    const ticketAttachment = await this.db.ticketAttachment.create({
      data: {
        id: v7(),
        workspaceId,
        ticketId,
        name,
        size,
        key,
      },
    });

    return TicketAttachmentsService.toEntity(ticketAttachment);
  }

  async delete(user: UserContext, args: DeleteTicketAttachmentArgs): Promise<TicketAttachmentEntity> {
    const { id, workspaceId, ticketId } = args;

    const ticketAttachment = await this.db.ticketAttachment.delete({ where: { id, workspaceId, ticketId } });

    return TicketAttachmentsService.toEntity(ticketAttachment);
  }

  async getById(user: UserContext, args: GetTicketAttachmentByIdArgs): Promise<TicketAttachmentEntity> {
    const { id } = args;

    const ticketAttachment = await this.db.ticketAttachment.findUnique({ where: { id } });

    if (!ticketAttachment) {
      throw new Error('Ticket attachment not found');
    }

    return TicketAttachmentsService.toEntity(ticketAttachment);
  }

  async queryByTicketId(user: UserContext, args: QueryTicketAttachmentsByTicketId): Promise<TicketAttachmentEntity[]> {
    const { ticketId } = args;

    const ticketAttachments = await this.db.ticketAttachment.findMany({
      where: {
        ticketId,
      },
    });

    const entities: TicketAttachmentEntity[] = ticketAttachments.map(TicketAttachmentsService.toEntity);

    return entities;
  }

  async queryByTicketIds(user: UserContext, args: QueryTicketAttachmentsByTicketIds): Promise<TicketAttachmentEntity[]> {
    const { ticketIds, order } = args;

    const ticketAttachments = await this.db.ticketAttachment.findMany({
      where: {
        ticketId: { in: ticketIds },
      },
      orderBy: {
        createdAt: order,
      },
    });

    const entities: TicketAttachmentEntity[] = ticketAttachments.map(TicketAttachmentsService.toEntity);

    return entities;
  }

  static toEntity(attachment: TicketAttachment): TicketAttachmentEntity {
    return {
      id: attachment.id,
      ticketId: attachment.ticketId,
      key: attachment.key,
      name: attachment.name,
      size: attachment.size,
      workspaceId: attachment.workspaceId,
      createdAt: attachment.createdAt.toISOString(),
      updatedAt: attachment.updatedAt.toISOString(),
    };
  }
}
