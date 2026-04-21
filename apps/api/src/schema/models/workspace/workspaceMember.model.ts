import { z } from 'zod';

import { schema } from '../../schema';

import { workspaceMemberService } from '../../../services';

export const workspaceMember = schema.model('workspaceMember', {
  schema: z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    email: z.string(),
    workspaceId: z.string(),
    isWorkspaceOwner: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    userId: field(),
    name: field(),
    email: field(),
    workspaceId: field(),
    isWorkspaceOwner: field(),
    createdAt: field(),
    updatedAt: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.id === entity.id;
  },

  queries: ({ querySingle, queryMany }) => ({
    workspaceMemberById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return workspaceMemberService.getById(context.user, {
          id: query.id,
        });
      },
    }),

    workspaceMembers: queryMany({
      query: z.object({
        workspaceId: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return workspaceMemberService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
        });
      },
    }),
  }),
});
