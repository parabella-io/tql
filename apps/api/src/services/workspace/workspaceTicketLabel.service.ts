import { WorkspaceTicketLabel } from '@server/database';
import { PrismaClient } from '../../database';
import { UserContext, WorkspaceTicketLabelEntity } from '../../schema/schema';
import { v7 } from 'uuid';

type CreateWorkspaceLabelArgs = {
  workspaceId: string;
  name: string;
};

type DeleteWorkspaceTicketLabelArgs = {
  workspaceId: string;
  id: string;
};

type GetWorkspaceLabelByIdArgs = {
  id: string;
};

type QueryByWorkspaceIdArgs = {
  workspaceId: string;
};

export class WorkspaceTicketLabelService {
  constructor(private readonly db: PrismaClient) {}

  async create(authUser: UserContext, args: CreateWorkspaceLabelArgs): Promise<WorkspaceTicketLabelEntity> {
    const { workspaceId, name } = args;

    const workspaceTicketLabel = await this.db.workspaceTicketLabel.create({
      data: { id: v7(), workspaceId, name },
    });

    return WorkspaceTicketLabelService.toEntity(workspaceTicketLabel);
  }

  async delete(authUser: UserContext, args: DeleteWorkspaceTicketLabelArgs): Promise<WorkspaceTicketLabelEntity> {
    const { workspaceId, id } = args;

    const workspaceTicketLabel = await this.db.workspaceTicketLabel.delete({
      where: { id, workspaceId },
    });

    return WorkspaceTicketLabelService.toEntity(workspaceTicketLabel);
  }

  async getById(authUser: UserContext, args: GetWorkspaceLabelByIdArgs): Promise<WorkspaceTicketLabelEntity> {
    const { id } = args;

    const foundWorkspaceTicketLabel = await this.db.workspaceTicketLabel.findUnique({
      where: { id },
    });

    if (!foundWorkspaceTicketLabel) {
      throw new Error('Workspace ticket label not found');
    }

    const workspaceTicketLabel: WorkspaceTicketLabelEntity = WorkspaceTicketLabelService.toEntity(foundWorkspaceTicketLabel);

    return workspaceTicketLabel;
  }

  async queryByWorkspaceId(user: UserContext, args: QueryByWorkspaceIdArgs): Promise<WorkspaceTicketLabelEntity[]> {
    const { workspaceId } = args;

    const workspaceTicketLabels = await this.db.workspaceTicketLabel.findMany({
      where: { workspaceId },
    });

    return workspaceTicketLabels.map(WorkspaceTicketLabelService.toEntity);
  }

  static toEntity(workspaceTicketLabel: WorkspaceTicketLabel): WorkspaceTicketLabelEntity {
    return {
      id: workspaceTicketLabel.id,
      name: workspaceTicketLabel.name,
      workspaceId: workspaceTicketLabel.workspaceId,
      createdAt: workspaceTicketLabel.createdAt.toISOString(),
      updatedAt: workspaceTicketLabel.updatedAt.toISOString(),
    };
  }
}
