import { v7 } from 'uuid';
import { PrismaClient, TicketList } from '../../database';

import { TicketListEntity, UserContext } from '../../schema/schema';

type GetTicketListByIdArgs = {
  id: string;
};

type CreateTicketListArgs = {
  workspaceId: string;
  name: string;
};

type UpdateTicketListArgs = {
  id: string;
  name: string;
};

type DeleteTicketListArgs = {
  id: string;
};

type QueryTicketListsByWorkspaceId = {
  workspaceId: string;
};

export class TicketListsService {
  constructor(private readonly db: PrismaClient) {}

  async create(user: UserContext, args: CreateTicketListArgs): Promise<TicketListEntity> {
    const { workspaceId, name } = args;

    const ticketList = await this.db.ticketList.create({
      data: {
        id: v7(),
        workspaceId,
        name,
      },
    });

    const entity: TicketListEntity = TicketListsService.toEntity(ticketList);

    return entity;
  }

  async update(user: UserContext, args: UpdateTicketListArgs): Promise<TicketListEntity> {
    const { id, name } = args;

    const ticketList = await this.db.ticketList.update({
      where: { id },
      data: { name },
    });

    const entity: TicketListEntity = TicketListsService.toEntity(ticketList);

    return entity;
  }

  async delete(user: UserContext, args: DeleteTicketListArgs): Promise<TicketListEntity> {
    const { id } = args;

    const ticketList = await this.db.ticketList.delete({
      where: { id },
    });

    const entity: TicketListEntity = TicketListsService.toEntity(ticketList);

    return entity;
  }

  async getById(user: UserContext, args: GetTicketListByIdArgs): Promise<TicketListEntity> {
    const { id } = args;

    const ticketList = await this.db.ticketList.findUnique({
      where: { id },
    });

    if (!ticketList) {
      throw new Error('Ticket list not found');
    }

    const entity: TicketListEntity = TicketListsService.toEntity(ticketList);

    return entity;
  }

  async queryByWorkspaceId(user: UserContext, args: QueryTicketListsByWorkspaceId): Promise<TicketListEntity[]> {
    const { workspaceId } = args;

    const ticketLists = await this.db.ticketList.findMany({
      where: {
        workspaceId,
      },
    });

    const entities: TicketListEntity[] = ticketLists.map(TicketListsService.toEntity);

    return entities;
  }

  static toEntity(ticketList: TicketList): TicketListEntity {
    return {
      id: ticketList.id,
      name: ticketList.name,
      workspaceId: ticketList.workspaceId,
      createdAt: ticketList.createdAt.toISOString(),
      updatedAt: ticketList.updatedAt.toISOString(),
    };
  }
}
