import { v7 } from 'uuid';
import { PrismaClient, TicketLabel, WorkspaceTicketLabel } from '../../database';

import { TicketLabelEntity, UserContext } from '../../schema/schema';

type AddTicketLabelArgs = {
  workspaceId: string;
  ticketId: string;
  labelId: string;
};

type RemoveTicketLabelArgs = {
  workspaceId: string;
  ticketId: string;
  id: string;
};

type GetTicketLabelByIdArgs = {
  id: string;
};

type QueryTicketLabelsByTicketId = {
  ticketId: string;
  order: 'asc' | 'desc';
};

type QueryTicketLabelsByTicketIds = {
  ticketIds: string[];
  order: 'asc' | 'desc';
};

export class TicketLabelsService {
  constructor(private readonly db: PrismaClient) {}

  async add(user: UserContext, args: AddTicketLabelArgs): Promise<TicketLabelEntity> {
    const { workspaceId, ticketId, labelId } = args;

    const ticketLabel = await this.db.ticketLabel.create({
      data: { id: v7(), workspaceId, ticketId, labelId },
      include: { label: true },
    });

    return TicketLabelsService.toEntity(ticketLabel);
  }

  async remove(user: UserContext, args: RemoveTicketLabelArgs): Promise<TicketLabelEntity> {
    const { workspaceId, ticketId, id } = args;

    const ticketLabel = await this.db.ticketLabel.delete({
      where: { id, workspaceId, ticketId },
      include: { label: true },
    });

    return TicketLabelsService.toEntity(ticketLabel);
  }

  async getById(user: UserContext, args: GetTicketLabelByIdArgs): Promise<TicketLabelEntity> {
    const { id } = args;

    const ticketLabel = await this.db.ticketLabel.findUnique({ where: { id }, include: { label: true } });

    if (!ticketLabel) {
      throw new Error('Ticket label not found');
    }

    return TicketLabelsService.toEntity(ticketLabel);
  }

  async queryByTicketId(user: UserContext, args: QueryTicketLabelsByTicketId): Promise<TicketLabelEntity[]> {
    const { ticketId, order } = args;

    const ticketLabels = await this.db.ticketLabel.findMany({
      where: {
        ticketId,
      },
      include: {
        label: true,
      },
      orderBy: {
        createdAt: order,
      },
    });

    const entities: TicketLabelEntity[] = ticketLabels.map(TicketLabelsService.toEntity);

    return entities;
  }

  async queryByTicketIds(user: UserContext, args: QueryTicketLabelsByTicketIds): Promise<TicketLabelEntity[]> {
    const { ticketIds, order } = args;

    const ticketLabels = await this.db.ticketLabel.findMany({
      where: {
        ticketId: { in: ticketIds },
      },
      orderBy: {
        createdAt: order,
      },
      include: {
        label: true,
      },
    });

    const entities: TicketLabelEntity[] = ticketLabels.map(TicketLabelsService.toEntity);

    return entities;
  }

  static toEntity(ticketLabel: TicketLabel & { label: WorkspaceTicketLabel }): TicketLabelEntity {
    return {
      id: ticketLabel.id,
      name: ticketLabel.label.name,
      workspaceTicketLabelId: ticketLabel.label.id,
      ticketId: ticketLabel.ticketId,
      workspaceId: ticketLabel.workspaceId,
      createdAt: ticketLabel.createdAt.toISOString(),
      updatedAt: ticketLabel.updatedAt.toISOString(),
    };
  }
}
