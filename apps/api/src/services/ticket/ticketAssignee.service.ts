import { PrismaClient, WorkspaceMember, User } from '../../database';

import { TicketAssigneeEntity, UserContext } from '../../schema/schema';

type AssignTicketMemberArgs = {
  workspaceId: string;
  ticketId: string;
  memberId: string;
};

type UnassignTicketMemberArgs = {
  workspaceId: string;
  ticketId: string;
};

type GetTicketAssigneeByIdArgs = {
  id: string;
};

type QueryTicketAssigneeByTicketIdArgs = {
  ticketId: string;
};

type QueryTicketAssigneeByTicketIdsArgs = {
  ticketIds: string[];
};

export class TicketAssigneeService {
  constructor(private readonly db: PrismaClient) {}

  async assign(user: UserContext, args: AssignTicketMemberArgs): Promise<TicketAssigneeEntity> {
    const { workspaceId, ticketId, memberId } = args;

    const member = await this.db.workspaceMember.findUnique({
      where: {
        id: memberId,
        workspaceId: workspaceId,
      },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    const ticketAssignee = await this.db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        assigneeId: memberId,
      },
      include: {
        assignee: {
          include: {
            user: true,
          },
        },
      },
    });

    return TicketAssigneeService.toEntity(ticketId, ticketAssignee.assignee!);
  }

  async unassign(user: UserContext, args: UnassignTicketMemberArgs): Promise<TicketAssigneeEntity> {
    const { workspaceId, ticketId } = args;

    const existingAssignee = await this.db.ticket.findUnique({
      where: {
        id: ticketId,
        workspaceId: workspaceId,
      },
      include: {
        assignee: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingAssignee?.assignee) {
      throw new Error('Assignee not found');
    }

    await this.db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        assigneeId: null,
      },
    });

    return TicketAssigneeService.toEntity(ticketId, existingAssignee.assignee!);
  }

  async getById(user: UserContext, args: GetTicketAssigneeByIdArgs): Promise<TicketAssigneeEntity> {
    const { id } = args;

    const ticketAssignee = await this.db.ticket.findUnique({
      where: {
        id,
      },
      include: {
        assignee: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!ticketAssignee?.assignee) {
      throw new Error('Ticket assignee not found');
    }

    return TicketAssigneeService.toEntity(id, ticketAssignee.assignee);
  }

  async queryByTicketId(user: UserContext, args: QueryTicketAssigneeByTicketIdArgs): Promise<TicketAssigneeEntity | null> {
    const { ticketId } = args;

    const ticket = await this.db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        assignee: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!ticket?.assignee) {
      return null;
    }

    return TicketAssigneeService.toEntity(ticketId, ticket.assignee);
  }

  async queryByTicketIds(user: UserContext, args: QueryTicketAssigneeByTicketIdsArgs): Promise<TicketAssigneeEntity[]> {
    const { ticketIds } = args;

    const tickets = await this.db.ticket.findMany({
      where: {
        id: { in: ticketIds },
      },
      include: {
        assignee: {
          include: {
            user: true,
          },
        },
      },
    });

    return tickets.filter((ticket) => ticket.assignee).map((ticket) => TicketAssigneeService.toEntity(ticket.id, ticket.assignee!));
  }

  static toEntity(ticketId: string, assignee: WorkspaceMember & { user: User }): TicketAssigneeEntity {
    return {
      id: assignee.id,
      ticketId: ticketId,
      workspaceId: assignee.workspaceId,
      userId: assignee.userId,
      name: assignee.user?.name,
      createdAt: assignee.createdAt.toISOString(),
      updatedAt: assignee.updatedAt.toISOString(),
    };
  }
}
