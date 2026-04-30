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

export type WorkspaceMemberPaged = {
  entities: WorkspaceMemberEntity[];
  pagingInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
};

type PagingCursor = {
  take: number;
  before: string | null;
  after: string | null;
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

  async queryByWorkspaceIdPaged(_user: UserContext, args: QueryByWorkspaceIdArgs, paging: PagingCursor): Promise<WorkspaceMemberPaged> {
    const { workspaceId } = args;

    const { take, before, after } = paging;

    if (before !== null) {
      const rows = await this.db.workspaceMember.findMany({
        where: { workspaceId, id: { lt: before } },
        orderBy: { id: 'desc' },
        take: take + 1,
        include: { user: true },
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

      const hasNextPage =
        (await this.db.workspaceMember.findFirst({
          where: { workspaceId, id: { gt: before } },
          orderBy: { id: 'asc' },
          take: 1,
        })) !== null;

      return {
        entities: slice.map(WorkspaceMemberService.toEntity),
        pagingInfo: {
          hasPreviousPage,
          hasNextPage,
          startCursor: slice[0]!.id,
          endCursor: slice[slice.length - 1]!.id,
        },
      };
    }

    const rows = await this.db.workspaceMember.findMany({
      where: { workspaceId },
      cursor: after ? { id: after } : undefined,
      skip: after ? 1 : 0,
      take: take + 1,
      orderBy: { id: 'asc' },
      include: { user: true },
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

    let hasPreviousPage = false;

    if (after !== null) {
      hasPreviousPage =
        (await this.db.workspaceMember.findFirst({
          where: { workspaceId, id: { lt: after } },
          orderBy: { id: 'desc' },
          take: 1,
        })) !== null;
    }

    return {
      entities: slice.map(WorkspaceMemberService.toEntity),
      pagingInfo: {
        hasPreviousPage,
        hasNextPage,
        startCursor: slice[0]!.id,
        endCursor: slice[slice.length - 1]!.id,
      },
    };
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
