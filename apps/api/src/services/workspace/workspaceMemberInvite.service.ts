import { WorkspaceMemberInvite } from '@server/database';
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

type QueryWorkspaceMemberInvitesArgs = {
  workspaceId: string;
};

type PagingCursor = {
  take: number;
  before: string | null;
  after: string | null;
};

export type WorkspaceMemberInvitePaged = {
  entities: WorkspaceMemberInviteEntity[];
  pagingInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
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

  async queryByWorkspaceIdPaged(
    _user: UserContext,
    args: QueryWorkspaceMemberInvitesArgs,
    paging: PagingCursor,
  ): Promise<WorkspaceMemberInvitePaged> {
    const { workspaceId } = args;
    const { take, before, after } = paging;

    if (take <= 0) {
      return {
        entities: [],
        pagingInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    if (before !== null) {
      const rows = await this.db.workspaceMemberInvite.findMany({
        where: { workspaceId, id: { lt: before } },
        orderBy: { id: 'desc' },
        take: take + 1,
      });
      const hasPreviousPage = rows.length > take;
      const sliceDesc = rows.slice(0, take);
      const slice = [...sliceDesc].reverse();

      if (slice.length === 0) {
        return {
          entities: [],
          pagingInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      return {
        entities: slice.map(WorkspaceMemberInviteService.toEntity),
        pagingInfo: {
          hasPreviousPage,
          hasNextPage: true,
          startCursor: slice[0]!.id,
          endCursor: slice[slice.length - 1]!.id,
        },
      };
    }

    if (after !== null) {
      const rows = await this.db.workspaceMemberInvite.findMany({
        where: { workspaceId },
        cursor: { id: after },
        skip: 1,
        take: take + 1,
        orderBy: { id: 'asc' },
      });
      const hasNextPage = rows.length > take;
      const slice = rows.slice(0, take);

      if (slice.length === 0) {
        return {
          entities: [],
          pagingInfo: {
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      return {
        entities: slice.map(WorkspaceMemberInviteService.toEntity),
        pagingInfo: {
          hasPreviousPage: true,
          hasNextPage,
          startCursor: slice[0]!.id,
          endCursor: slice[slice.length - 1]!.id,
        },
      };
    }

    const rows = await this.db.workspaceMemberInvite.findMany({
      where: { workspaceId },
      orderBy: { id: 'asc' },
      take: take + 1,
    });
    const hasNextPage = rows.length > take;
    const slice = rows.slice(0, take);

    if (slice.length === 0) {
      return {
        entities: [],
        pagingInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    return {
      entities: slice.map(WorkspaceMemberInviteService.toEntity),
      pagingInfo: {
        hasPreviousPage: false,
        hasNextPage,
        startCursor: slice[0]!.id,
        endCursor: slice[slice.length - 1]!.id,
      },
    };
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
