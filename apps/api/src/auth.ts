import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './database-client';
import { bearer } from 'better-auth/plugins';
import { emailOTP } from 'better-auth/plugins';
import { customSession } from 'better-auth/plugins';
import { faker } from '@faker-js/faker';

const isDevOrTest = (email: string) => {
  return true;
};

export const auth = betterAuth({
  baseURL: 'http://localhost:3001',
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  trustedOrigins: ['http://localhost:3000'],
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      generateOTP: ({ email }) => {
        if (isDevOrTest(email)) {
          return '000000';
        }

        return undefined;
      },
      async sendVerificationOTP({ email, otp, type }) {
        if (isDevOrTest(email)) {
          return;
        }

        // send real email
      },
    }),
    customSession(async ({ user, session }) => {
      if (user.name === '') {
        const name = faker.person.firstName();

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: name,
          },
        });

        user.name = name;
      }

      const workspaceIds = await db.workspace.findMany({
        where: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      return {
        user: {
          ...user,
          workspaceIds: workspaceIds.map((workspace) => workspace.id),
        },

        session,
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
});
