import { z } from 'zod';

import { schema } from '../../schema';

import { workspaceService, workspaceMemberService } from '../../../services';

export const workspace = schema.model('workspace', {
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    name: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.id);
  },

  queries: ({ querySingle, queryMany }) => ({
    workspaceById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return workspaceService.getById(context.user, { id: query.id });
      },
    }),

    myWorkspaces: queryMany({
      query: z.object({}),
      resolve: async ({ context, query }) => {
        return workspaceService.getMyWorkspaces(context.user);
      },
    }),
  }),

  includes: ({ includeSingle }) => ({
    owner: includeSingle('workspaceMember', {
      matchKey: 'workspaceId',
      resolve: async ({ context, parents }) => {
        return workspaceMemberService.queryOwnersByWorkspaceIds(context.user, {
          workspaceIds: parents.map((parent) => parent.id),
        });
      },
    }),
  }),
});
