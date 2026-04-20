import { z } from 'zod';

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
        return context.workspaceMemberInviteService.getById(context.user, {
          inviteId: query.id,
        });
      },
    }),

    myWorkspaceInvites: queryMany({
      query: z.object({}),
      resolve: async ({ context, query }) => {
        return context.workspaceMemberInviteService.queryMyWorkspaceInvites(context.user);
      },
    }),

    workspaceMemberInvites: queryMany({
      query: z.object({
        workspaceId: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return context.workspaceMemberInviteService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
        });
      },
    }),
  }),

  includes: ({ includeSingle }) => ({
    workspace: includeSingle('workspace', {
      matchKey: 'workspaceMemberInviteId',
      resolve: async ({ context, parents }) => {
        const workspaces = await context.workspaceService.queryByWorkspaceIds(context.user, {
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
