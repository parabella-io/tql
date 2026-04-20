import { PrismaClient, TicketComment } from '../../database';
import { TicketCommentEntity, UserContext } from '../../schema/schema';

type GetTicketCommentByIdArgs = {
  id: string;
};

type QueryTicketCommentsByTicketId = {
  ticketId: string;
  order: 'asc' | 'desc';
};

type QueryTicketCommentsByTicketIds = {
  ticketIds: string[];
  order: 'asc' | 'desc';
};

export class TicketCommentsService {
  constructor(private readonly db: PrismaClient) {}

  async getById(user: UserContext, args: GetTicketCommentByIdArgs): Promise<TicketCommentEntity> {
    const { id } = args;

    const ticketComment = await this.db.ticketComment.findUnique({ where: { id } });

    if (!ticketComment) {
      throw new Error('Ticket comment not found');
    }

    return TicketCommentsService.toEntity(ticketComment);
  }

  async queryByTicketId(user: UserContext, args: QueryTicketCommentsByTicketId): Promise<TicketCommentEntity[]> {
    const { ticketId } = args;

    const ticketComments = await this.db.ticketComment.findMany({
      where: {
        ticketId,
      },
    });

    const entities: TicketCommentEntity[] = ticketComments.map(TicketCommentsService.toEntity);

    return entities;
  }

  async queryByTicketIds(user: UserContext, args: QueryTicketCommentsByTicketIds): Promise<TicketCommentEntity[]> {
    const { ticketIds, order } = args;

    const ticketComments = await this.db.ticketComment.findMany({
      where: {
        ticketId: { in: ticketIds },
      },
      orderBy: {
        createdAt: order,
      },
    });

    const entities: TicketCommentEntity[] = ticketComments.map(TicketCommentsService.toEntity);

    return entities;
  }

  static toEntity(ticketComment: TicketComment): TicketCommentEntity {
    return {
      id: ticketComment.id,
      content: ticketComment.content,
      ticketId: ticketComment.ticketId,
      workspaceId: ticketComment.workspaceId,
      createdAt: ticketComment.createdAt.toISOString(),
      updatedAt: ticketComment.updatedAt.toISOString(),
    };
  }
}
