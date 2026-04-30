import { faker } from '@faker-js/faker';
import { v7 as uuidv7 } from 'uuid';

import type { PrismaClient } from '../../src/database';
import { PRIMARY_TEST_USER_EMAIL, assertSafeDatabaseReset, type SeedConfig } from './config.js';
import { SEED_CREDENTIAL_PASSWORD_HASH } from './credentials.js';
import type { SeedGenerators } from './generators.js';
import { mergeGenerators } from './generators.js';

async function wipe(db: PrismaClient): Promise<void> {
  await db.ticketLabel.deleteMany();
  await db.ticketComment.deleteMany();
  await db.ticketAttachment.deleteMany();
  await db.ticket.deleteMany();
  await db.ticketList.deleteMany();
  await db.workspaceTicketLabel.deleteMany();
  await db.workspaceMemberInvite.deleteMany();
  await db.workspaceMember.deleteMany();
  await db.workspace.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.verification.deleteMany();
  await db.user.deleteMany();
}

async function createUserWithCredential(db: PrismaClient, email: string, name: string): Promise<{ id: string; email: string }> {
  const userId = uuidv7();

  const now = new Date();

  await db.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  });

  await db.account.create({
    data: {
      id: uuidv7(),
      userId,
      accountId: userId,
      providerId: 'credential',
      password: SEED_CREDENTIAL_PASSWORD_HASH,
      createdAt: now,
      updatedAt: now,
    },
  });

  return { id: userId, email };
}

export type SeedResult = {
  primaryUserId: string;
  primaryEmail: string;
  workspaceIds: string[];
  ticketIds: string[];
};

export async function runSeed(
  db: PrismaClient,
  seedConfig: SeedConfig,
  databaseUrl: string,
  generatorOverrides?: Partial<SeedGenerators>,
): Promise<SeedResult> {
  assertSafeDatabaseReset(databaseUrl, seedConfig);

  const gens = mergeGenerators(generatorOverrides ?? {});

  if (seedConfig.fakerSeed !== undefined) {
    faker.seed(seedConfig.fakerSeed);
  }

  const existingPrimary = await db.user.findUnique({
    where: { email: PRIMARY_TEST_USER_EMAIL },
  });

  if (!seedConfig.reset && existingPrimary) {
    console.info(`Seed skipped: ${PRIMARY_TEST_USER_EMAIL} already exists. Set reset: true in prisma/seed/config.ts to wipe and re-seed.`);
    return {
      primaryUserId: existingPrimary.id,
      primaryEmail: PRIMARY_TEST_USER_EMAIL,
      workspaceIds: [],
      ticketIds: [],
    };
  }

  if (seedConfig.reset) {
    await wipe(db);
  }

  const primaryUser = await createUserWithCredential(db, PRIMARY_TEST_USER_EMAIL, gens.userName(PRIMARY_TEST_USER_EMAIL));

  const workspaceIds: string[] = [];

  const ticketIds: string[] = [];

  for (let w = 0; w < seedConfig.workspaceCount; w++) {
    const workspaceId = uuidv7();

    const now = new Date();

    await db.workspace.create({
      data: {
        id: workspaceId,
        name: gens.workspaceName({ workspaceIndex: w, ownerUserId: primaryUser.id }),
        createdAt: now,
        updatedAt: now,
      },
    });

    workspaceIds.push(workspaceId);

    const ownerMemberId = uuidv7();

    await db.workspaceMember.create({
      data: {
        id: ownerMemberId,
        workspaceId,
        userId: primaryUser.id,
        isWorkspaceOwner: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    const memberIdsForWorkspace: string[] = [ownerMemberId];

    for (let m = 0; m < seedConfig.extraMembersPerWorkspace; m++) {
      const email = `seed-w${w}-m${m}@seed.local`;
      const extraUser = await createUserWithCredential(db, email, gens.userName(email));
      const memberId = uuidv7();
      await db.workspaceMember.create({
        data: {
          id: memberId,
          workspaceId,
          userId: extraUser.id,
          isWorkspaceOwner: false,
          createdAt: now,
          updatedAt: now,
        },
      });
      memberIdsForWorkspace.push(memberId);
    }

    const listIdByIndex: string[] = [];
    for (let l = 0; l < seedConfig.ticketListsPerWorkspace; l++) {
      const listId = uuidv7();
      listIdByIndex.push(listId);
      await db.ticketList.create({
        data: {
          id: listId,
          name: gens.ticketListName({ workspaceIndex: w, listIndex: l }),
          workspaceId,
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    const labelIds: string[] = [];
    for (let lb = 0; lb < seedConfig.labelsPerWorkspace; lb++) {
      const lid = uuidv7();
      labelIds.push(lid);
      await db.workspaceTicketLabel.create({
        data: {
          id: lid,
          name: gens.workspaceLabelName({ workspaceIndex: w, labelIndex: lb }),
          workspaceId,
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    for (let l = 0; l < seedConfig.ticketListsPerWorkspace; l++) {
      const listId = listIdByIndex[l]!;
      for (let t = 0; t < seedConfig.ticketsPerList; t++) {
        const reporterId = faker.helpers.arrayElement(memberIdsForWorkspace)!;

        let assigneeId: string | null = null;

        const others = memberIdsForWorkspace.filter((id) => id !== reporterId);

        if (others.length > 0 && faker.helpers.arrayElement([true, false])) {
          assigneeId = faker.helpers.arrayElement(others)!;
        }

        const ticketId = uuidv7();

        await db.ticket.create({
          data: {
            id: ticketId,
            title: gens.ticketTitle({ workspaceIndex: w, listIndex: l, ticketIndex: t }),
            description: gens.ticketDescription({ workspaceIndex: w, listIndex: l, ticketIndex: t }),
            workspaceId,
            ticketListId: listId,
            reporterId,
            assigneeId,
            createdAt: now,
            updatedAt: now,
          },
        });

        ticketIds.push(ticketId);

        for (let c = 0; c < seedConfig.commentsPerTicket; c++) {
          await db.ticketComment.create({
            data: {
              id: uuidv7(),
              ticketId,
              workspaceId,
              content: gens.commentBody({
                workspaceIndex: w,
                ticketIndex: t,
                commentIndex: c,
              }),
              createdAt: now,
              updatedAt: now,
            },
          });
        }

        if (labelIds.length > 0 && faker.helpers.arrayElement([true, false])) {
          const labelId = faker.helpers.arrayElement(labelIds)!;
          await db.ticketLabel.create({
            data: {
              id: uuidv7(),
              ticketId,
              workspaceId,
              labelId,
              createdAt: now,
              updatedAt: now,
            },
          });
        }
      }
    }
  }

  return {
    primaryUserId: primaryUser.id,
    primaryEmail: PRIMARY_TEST_USER_EMAIL,
    workspaceIds,
    ticketIds,
  };
}
