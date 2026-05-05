import { z } from 'zod';
import { workspaceMemberInviteService } from '../../../services';
import { workspaceService } from '../../../services';
import { schema } from '../../schema';

export const workspaceMemberInvite = schema.model('workspaceMemberInvite', {
  schema: z.object({
    id: z.string(),
    email: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    email: field(),
    workspaceId: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    workspaceMemberInviteById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return workspaceMemberInviteService.getById(context.user, {
          inviteId: query.id,
        });
      },
    }),

    myWorkspaceInvites: queryMany({
      query: z.object({}),
      resolve: async ({ context }) => {
        return workspaceMemberInviteService.queryMyWorkspaceInvites(context.user);
      },
    }),

    workspaceMemberInvites: queryMany({
      query: z.object({
        workspaceId: z.string(),
      }),
      withPaging: {
        defaultTakeSize: 10,
        maxTakeSize: 100,
        minTakeSize: 1,
      },
      resolve: async ({ context, query, pagingInfo }) => {
        return workspaceMemberInviteService.queryByWorkspaceIdPaged(
          context.user,
          {
            workspaceId: query.workspaceId,
          },
          pagingInfo,
        );
      },
    }),
  }),

  includes: ({ includeSingle }) => ({
    workspace: includeSingle('workspace', {
      matchKey: 'workspaceMemberInviteId',
      resolve: async ({ context, parents }) => {
        const workspaces = await workspaceService.queryByWorkspaceIds(context.user, {
          workspaceIds: parents.map((parent) => parent.workspaceId),
        });

        return parents.flatMap((parent) => {
          const workspace = workspaces.find((item) => item.id === parent.workspaceId);

          return workspace
            ? [
                {
                  ...workspace,
                  workspaceMemberInviteId: parent.id,
                },
              ]
            : [];
        });
      },
    }),
  }),
});
