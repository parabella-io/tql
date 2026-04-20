import { Prisma, PrismaClient, Ticket } from '../../database';
import { TicketEntity, UserContext } from '../../schema/schema';
import { v7 } from 'uuid';

type GetTicketByIdArgs = {
  id: string;
};

type CreateTicketArgs = {
  title: string;
  workspaceId: string;
  ticketListId: string;
};

type QueryTicketsByWorkspaceId = {
  workspaceId: string;
  limit: number;
  order: 'asc' | 'desc';
};

type UpdateTicketArgs = {
  id: string;
  title: string;
  description: string;
};

type MoveTicketArgs = {
  id: string;
  oldTicketListId: string;
  newTicketListId: string;
};

type QueryTicketsByTicketListId = {
  limit: number;
  ticketListId: string;
  order: 'asc' | 'desc';
};

type QueryTicketsByTicketListIds = {
  limit: number;
  ticketListIds: string[];
  order: 'asc' | 'desc';
};

export class TicketsService {
  constructor(private readonly db: PrismaClient) {}

  async create(user: UserContext, args: CreateTicketArgs): Promise<TicketEntity> {
    const { title, workspaceId, ticketListId } = args;

    const workspaceMember = await this.db.workspaceMember.findUniqueOrThrow({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    const ticket = await this.db.ticket.create({
      data: {
        id: v7(),
        title,
        description: '',
        workspaceId,
        ticketListId,
        reporterId: workspaceMember.id,
      },
    });

    const entity: TicketEntity = TicketsService.toEntity(ticket);

    return entity;
  }

  async update(user: UserContext, args: UpdateTicketArgs): Promise<TicketEntity> {
    const { id, title, description } = args;

    const ticket = await this.db.ticket.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    const entity: TicketEntity = TicketsService.toEntity(ticket);

    return entity;
  }

  async moveList(user: UserContext, args: MoveTicketArgs): Promise<TicketEntity> {
    const { id, newTicketListId } = args;

    const ticket = await this.db.ticket.update({
      where: { id },
      data: {
        ticketListId: newTicketListId,
      },
    });

    const entity: TicketEntity = TicketsService.toEntity(ticket);

    return entity;
  }

  async getById(user: UserContext, args: GetTicketByIdArgs): Promise<TicketEntity> {
    const { id } = args;

    const ticket = await this.db.ticket.findUnique({
      where: { id },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const entity: TicketEntity = TicketsService.toEntity(ticket);

    return entity;
  }

  async queryByWorkspaceId(user: UserContext, args: QueryTicketsByWorkspaceId): Promise<TicketEntity[]> {
    const { workspaceId, limit, order } = args;

    const tickets = await this.db.ticket.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: order,
      },
      take: limit,
    });

    const entities: TicketEntity[] = tickets.map(TicketsService.toEntity);

    return entities;
  }

  async queryByTicketListId(user: UserContext, args: QueryTicketsByTicketListId): Promise<TicketEntity[]> {
    const { ticketListId, limit, order } = args;

    const tickets = await this.db.ticket.findMany({
      where: {
        ticketListId,
      },
      orderBy: {
        createdAt: order,
      },
      take: limit,
    });

    const entities: TicketEntity[] = tickets.map(TicketsService.toEntity);

    return entities;
  }

  async queryByTicketListIds(user: UserContext, args: QueryTicketsByTicketListIds): Promise<TicketEntity[]> {
    const { limit, ticketListIds, order } = args;

    if (ticketListIds.length === 0) {
      return [];
    }

    const tickets = await this.db.$queryRaw<Ticket[]>(
      Prisma.sql`
        SELECT t.*
        FROM UNNEST(${ticketListIds}::text[]) AS listId(id)
        JOIN LATERAL (
          SELECT *
          FROM "Ticket"
          WHERE "ticketListId" = listId.id
          ORDER BY "createdAt" ${Prisma.raw(order === 'asc' ? 'ASC' : 'DESC')}
          LIMIT ${limit}
        ) t ON TRUE
      `,
    );

    return tickets.map(TicketsService.toEntity);
  }

  static toEntity(ticket: Ticket): TicketEntity {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      workspaceId: ticket.workspaceId,
      ticketListId: ticket.ticketListId,
      assigneeId: ticket.assigneeId,
      reporterId: ticket.reporterId,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }
}
