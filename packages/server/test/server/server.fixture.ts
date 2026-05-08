import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import type { SchemaEntities } from '../harness/schema-entities.js';
import type { PrismaClient } from '../prisma/database.js';

type ServerSchemaContext = {
  userId: string;
  isAuthenticated: boolean;
  database: PrismaClient;
};

export type ServerClientSchema = {
  SchemaEntities: SchemaEntities;
  QueryInputMap: Record<string, any>;
  QueryResponseMap: Record<string, any>;
  QueryRegistry: Record<string, any>;
  MutationInputMap: Record<string, any>;
  MutationResponseMap: Record<string, any>;
  MutationOutputMap: Record<string, any>;
};

const profileOutput = z.object({
  id: z.string(),
  name: z.string(),
  hobbies: z.array(z.object({ level: z.number(), name: z.string() })),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
});

export const createServerSchema = () => {
  const schema = new Schema<ServerSchemaContext, SchemaEntities>();

  schema.model('profile', {
    schema: profileOutput,
    fields: ({ field }) => ({
      id: field(),
      name: field(),
      hobbies: field(),
      address: field(),
    }),
    queries: ({ querySingle }) => ({
      profileById: querySingle({
        query: z.object({ id: z.string() }),
        resolve: async ({ context, query }) => {
          const profile = await context.database.profile.findUniqueOrThrow({
            where: { id: query.id },
          });

          return {
            id: profile.id,
            name: profile.name,
            hobbies: JSON.parse(profile.hobbies),
            address: JSON.parse(profile.address),
          };
        },
      }),
    }),
  });

  schema.mutation('createProfile', {
    input: z.object({
      name: z.string(),
      hobbies: z.array(z.object({ level: z.number(), name: z.string() })),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    }),
    output: z.object({
      profile: profileOutput,
    }),
    allow: ({ context }) => context.isAuthenticated,
    resolve: async ({ input, context }) => {
      await context.database.profile.create({
        data: {
          id: context.userId,
          name: input.name,
          hobbies: JSON.stringify(input.hobbies),
          address: JSON.stringify(input.address),
        },
      });

      return {
        profile: {
          id: context.userId,
          name: input.name,
          hobbies: input.hobbies,
          address: input.address,
        },
      };
    },
  });

  return schema;
};
