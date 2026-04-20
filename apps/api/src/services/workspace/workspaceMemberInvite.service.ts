import { User, WorkspaceMember, WorkspaceMemberInvite } from '@server/database';
import { PrismaClient } from '../../database';
import { UserContext, WorkspaceEntity, WorkspaceMemberEntity, WorkspaceMemberInviteEntity } from '../../schema/schema';
import { v7 } from 'uuid';
import { WorkspaceMemberService } from './workspaceMember.service';
import { WorkspaceService } from './workspace.service';

type InviteWorkspaceMemberInviteArgs = {
  workspaceId: string;
  email: string;
};

type RemoveWorkspaceMemberInviteArgs = {
  workspaceId: string;
  inviteId: string;
};

type AcceptWorkspaceMemberInviteArgs = {
  workspaceId: string;
  inviteId: string;
};

type DeclineWorkspaceMemberInviteArgs = {
  workspaceId: string;
  inviteId: string;
};

type GetWorkspaceMemberInviteByIdArgs = {
  inviteId: string;
};

type QueryMyWorkspaceInvitesArgs = {
  workspaceId: string;
};

type QueryWorkspaceMemberInvitesArgs = {
  workspaceId: string;
};

export class WorkspaceMemberInviteService {
  constructor(private readonly db: PrismaClient) {}

  async invite(authUser: UserContext, args: InviteWorkspaceMemberInviteArgs): Promise<WorkspaceMemberInviteEntity> {
    const { workspaceId, email } = args;

    const workspaceMemberInvite = await this.db.workspaceMemberInvite.create({
      data: { id: v7(), workspaceId, email },
    });

    return WorkspaceMemberInviteService.toEntity(workspaceMemberInvite);
  }

  async remove(authUser: UserContext, args: RemoveWorkspaceMemberInviteArgs): Promise<WorkspaceMemberInviteEntity> {
    const { workspaceId, inviteId } = args;

    const foundWorkspaceMemberInvite = await this.db.workspaceMemberInvite.findUnique({
      where: { workspaceId, id: inviteId },
    });

    if (!foundWorkspaceMemberInvite) {
      throw new Error('Workspace member invite not found');
    }

    await this.db.workspaceMemberInvite.delete({
      where: { id: inviteId },
    });

    return WorkspaceMemberInviteService.toEntity(foundWorkspaceMemberInvite);
  }

  async accept(
    authUser: UserContext,
    args: AcceptWorkspaceMemberInviteArgs,
  ): Promise<{ workspaceMember: WorkspaceMemberEntity; workspaceMemberInvite: WorkspaceMemberInviteEntity; workspace: WorkspaceEntity }> {
    const { workspaceId, inviteId } = args;

    const workspace = await this.db.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const foundWorkspaceMemberInvite = await this.db.workspaceMemberInvite.findUnique({
      where: { id: inviteId },
    });

    if (!foundWorkspaceMemberInvite) {
      throw new Error('Workspace member invite not found');
    }

    const workspaceMember = await this.db.$transaction(async (tx) => {
      await tx.workspaceMemberInvite.delete({
        where: { id: inviteId },
      });

      return await tx.workspaceMember.create({
        data: { id: v7(), workspaceId, userId: authUser.id },
        include: {
          user: true,
        },
      });
    });

    return {
      workspace: WorkspaceService.toEntity(workspace),
      workspaceMember: WorkspaceMemberService.toEntity(workspaceMember),
      workspaceMemberInvite: WorkspaceMemberInviteService.toEntity(foundWorkspaceMemberInvite),
    };
  }

  async decline(authUser: UserContext, args: DeclineWorkspaceMemberInviteArgs): Promise<WorkspaceMemberInviteEntity> {
    const { workspaceId, inviteId } = args;

    const foundWorkspaceMemberInvite = await this.db.workspaceMemberInvite.findUnique({
      where: { id: inviteId },
    });

    if (!foundWorkspaceMemberInvite) {
      throw new Error('Workspace member invite not found');
    }

    await this.db.workspaceMemberInvite.delete({
      where: { id: inviteId },
    });

    return WorkspaceMemberInviteService.toEntity(foundWorkspaceMemberInvite);
  }

  async getById(authUser: UserContext, args: GetWorkspaceMemberInviteByIdArgs): Promise<WorkspaceMemberInviteEntity> {
    const { inviteId } = args;

    const foundWorkspaceMemberInvite = await this.db.workspaceMemberInvite.findUnique({
      where: { id: inviteId },
    });

    if (!foundWorkspaceMemberInvite) {
      throw new Error('Workspace member invite not found');
    }

    const workspaceMemberInvite: WorkspaceMemberInviteEntity = WorkspaceMemberInviteService.toEntity(foundWorkspaceMemberInvite);

    return workspaceMemberInvite;
  }

  async queryMyWorkspaceInvites(user: UserContext): Promise<WorkspaceMemberInviteEntity[]> {
    const workspaceMemberInvites = await this.db.workspaceMemberInvite.findMany({
      where: { email: user.email },
    });

    return workspaceMemberInvites.map(WorkspaceMemberInviteService.toEntity);
  }

  async queryByWorkspaceId(user: UserContext, args: QueryWorkspaceMemberInvitesArgs): Promise<WorkspaceMemberInviteEntity[]> {
    const { workspaceId } = args;

    const workspaceMemberInvites = await this.db.workspaceMemberInvite.findMany({
      where: { workspaceId },
    });

    return workspaceMemberInvites.map(WorkspaceMemberInviteService.toEntity);
  }

  static toEntity(workspaceMemberInvite: WorkspaceMemberInvite): WorkspaceMemberInviteEntity {
    return {
      id: workspaceMemberInvite.id,
      email: workspaceMemberInvite.email,
      workspaceId: workspaceMemberInvite.workspaceId,
      createdAt: workspaceMemberInvite.createdAt.toISOString(),
      updatedAt: workspaceMemberInvite.updatedAt.toISOString(),
    };
  }
}
