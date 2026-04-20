import { User, WorkspaceMember } from '@server/database';
import { PrismaClient } from '../../database';
import { UserContext, WorkspaceMemberEntity } from '../../schema/schema';

type RemoveWorkspaceMemberArgs = {
  workspaceId: string;
  memberId: string;
};

type GetWorkspaceMemberByIdArgs = {
  id: string;
};

type QueryByWorkspaceIdArgs = {
  workspaceId: string;
};

type QueryOwnersByWorkspaceIdsArgs = {
  workspaceIds: string[];
};

export class WorkspaceMemberService {
  constructor(private readonly db: PrismaClient) {}

  async remove(authUser: UserContext, args: RemoveWorkspaceMemberArgs): Promise<WorkspaceMemberEntity> {
    const { workspaceId, memberId } = args;

    const foundWorkspaceMember = await this.db.workspaceMember.findUnique({
      where: { workspaceId, id: memberId },
      include: {
        user: true,
      },
    });

    if (!foundWorkspaceMember) {
      throw new Error('Workspace member not found');
    }

    if (foundWorkspaceMember.isWorkspaceOwner) {
      throw new Error('Cannot remove workspace owner');
    }

    await this.db.workspaceMember.delete({
      where: { id: memberId },
    });

    return WorkspaceMemberService.toEntity(foundWorkspaceMember);
  }

  async getById(authUser: UserContext, args: GetWorkspaceMemberByIdArgs): Promise<WorkspaceMemberEntity> {
    const { id } = args;

    const foundWorkspaceMember = await this.db.workspaceMember.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!foundWorkspaceMember) {
      throw new Error('User not found');
    }

    const workspaceMember: WorkspaceMemberEntity = WorkspaceMemberService.toEntity(foundWorkspaceMember);

    return workspaceMember;
  }

  async queryByWorkspaceId(user: UserContext, args: QueryByWorkspaceIdArgs): Promise<WorkspaceMemberEntity[]> {
    const { workspaceId } = args;

    const workspaceMembers = await this.db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: true,
      },
    });

    return workspaceMembers.map(WorkspaceMemberService.toEntity);
  }

  async queryOwnersByWorkspaceIds(user: UserContext, args: QueryOwnersByWorkspaceIdsArgs): Promise<WorkspaceMemberEntity[]> {
    const { workspaceIds } = args;

    const workspaceMembers = await this.db.workspaceMember.findMany({
      where: { workspaceId: { in: workspaceIds }, isWorkspaceOwner: true },
      include: { user: true },
    });

    return workspaceMembers.map(WorkspaceMemberService.toEntity);
  }

  static toEntity(workspaceMember: WorkspaceMember & { user: User }): WorkspaceMemberEntity {
    return {
      id: workspaceMember.id,
      userId: workspaceMember.userId,
      name: workspaceMember.user.name,
      email: workspaceMember.user.email,
      workspaceId: workspaceMember.workspaceId,
      isWorkspaceOwner: workspaceMember.isWorkspaceOwner,
      createdAt: workspaceMember.createdAt.toISOString(),
      updatedAt: workspaceMember.updatedAt.toISOString(),
    };
  }
}
