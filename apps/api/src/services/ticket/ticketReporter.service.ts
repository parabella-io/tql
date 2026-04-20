import { PrismaClient, WorkspaceMember, User } from '../../database';

import { TicketAssigneeEntity, TicketReporterEntity, UserContext } from '../../schema/schema';

type GetTicketReporterByIdArgs = {
  id: string;
};

type GetTicketReporterByTicketIdArgs = {
  ticketId: string;
};

type QueryTicketReporterByTicketIdsArgs = {
  ticketIds: string[];
};

export class TicketReporterService {
  constructor(private readonly db: PrismaClient) {}

  async getById(user: UserContext, args: GetTicketReporterByIdArgs): Promise<TicketReporterEntity> {
    const { id } = args;

    const ticketReporter = await this.db.ticket.findUnique({
      where: {
        id,
      },
      include: {
        reporter: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!ticketReporter?.reporter) {
      throw new Error('Ticket reporter not found');
    }

    return TicketReporterService.toEntity(id, ticketReporter.reporter);
  }

  async getByTicketId(user: UserContext, args: GetTicketReporterByTicketIdArgs): Promise<TicketReporterEntity> {
    const { ticketId } = args;

    const ticket = await this.db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        reporter: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!ticket?.reporter) {
      throw new Error('Ticket reporter not found');
    }

    return TicketReporterService.toEntity(ticketId, ticket.reporter);
  }

  async queryByTicketIds(user: UserContext, args: QueryTicketReporterByTicketIdsArgs): Promise<TicketReporterEntity[]> {
    const { ticketIds } = args;

    const tickets = await this.db.ticket.findMany({
      where: {
        id: { in: ticketIds },
      },
      include: {
        reporter: {
          include: {
            user: true,
          },
        },
      },
    });

    return tickets.map((ticket) => TicketReporterService.toEntity(ticket.id, ticket.reporter));
  }

  static toEntity(ticketId: string, reporter: WorkspaceMember & { user: User }): TicketReporterEntity {
    return {
      id: reporter.id,
      ticketId: ticketId,
      workspaceId: reporter.workspaceId,
      userId: reporter.userId,
      name: reporter.user.name,
      createdAt: reporter.createdAt.toISOString(),
      updatedAt: reporter.updatedAt.toISOString(),
    };
  }
}
