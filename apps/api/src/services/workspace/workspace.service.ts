import z from 'zod';
import { Prisma, PrismaClient, Workspace } from '../../database';
import { WorkspaceEntity, UserContext } from '../../schema/schema';
import { v7 } from 'uuid';

type CreateWorkspaceArgs = {
  name: string;
};

type UpdateWorkspaceArgs = {
  id: string;
  name: string;
};

type DeleteWorkspaceArgs = {
  id: string;
};

type GetWorkspaceByIdArgs = {
  id: string;
};

type QueryWorkspacesArgs = {
  name?: string;
  limit?: number;
  cursor?: { id: string };
  order?: 'asc' | 'desc';
};

type QueryByWorkspaceIdsArgs = {
  workspaceIds: string[];
};

export class WorkspaceService {
  constructor(private readonly db: PrismaClient) {}

  async createWorkspace(user: UserContext, args: CreateWorkspaceArgs): Promise<WorkspaceEntity> {
    const workspace = await this.db.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          id: v7(),
          name: args.name,
        },
      });

      await tx.workspaceMember.create({
        data: {
          id: v7(),
          workspaceId: workspace.id,
          userId: user.id,
          isWorkspaceOwner: true,
        },
      });

      return workspace;
    });

    return WorkspaceService.toEntity(workspace);
  }

  async updateWorkspace(user: UserContext, args: UpdateWorkspaceArgs): Promise<WorkspaceEntity> {
    const { id, name } = args;

    const workspace = await this.db.workspace.update({ where: { id }, data: { name } });

    return WorkspaceService.toEntity(workspace);
  }

  async deleteWorkspace(user: UserContext, args: DeleteWorkspaceArgs): Promise<WorkspaceEntity> {
    const { id } = args;

    const workspace = await this.db.workspace.delete({ where: { id } });

    return WorkspaceService.toEntity(workspace);
  }

  async getById(user: UserContext, args: GetWorkspaceByIdArgs): Promise<WorkspaceEntity> {
    const { id } = args;

    const workspace = await this.db.workspace.findUnique({ where: { id } });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const entity: WorkspaceEntity = WorkspaceService.toEntity(workspace);

    return entity;
  }

  async getMyWorkspaces(user: UserContext): Promise<WorkspaceEntity[]> {
    const workspaces = await this.db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    const entities: WorkspaceEntity[] = workspaces.map(WorkspaceService.toEntity);

    return entities;
  }

  async queryWorkspaces(user: UserContext, query: QueryWorkspacesArgs): Promise<WorkspaceEntity[]> {
    const { name, limit, cursor, order } = query;

    const where: Prisma.WorkspaceWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
      };
    }

    const workspaces = await this.db.workspace.findMany({
      where,
      orderBy: {
        id: order,
      },
      take: limit,
      cursor: cursor ?? undefined,
    });

    const entities: WorkspaceEntity[] = workspaces.map(WorkspaceService.toEntity);

    return entities;
  }

  async queryByWorkspaceIds(user: UserContext, args: QueryByWorkspaceIdsArgs): Promise<WorkspaceEntity[]> {
    const { workspaceIds } = args;

    const workspaces = await this.db.workspace.findMany({ where: { id: { in: workspaceIds } } });

    return workspaces.map(WorkspaceService.toEntity);
  }

  static toEntity(workspace: Workspace): WorkspaceEntity {
    return {
      id: workspace.id,
      name: workspace.name,
    };
  }
}
