import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { v7 } from 'uuid';
import { UTCDate } from '@date-fns/utc';
import { PrismaClient, Workspace, User, Ticket } from '../../src/database';
import { faker } from '@faker-js/faker';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});

export const WORKSPACE_COUNT_PER_USER = 3;

export const TICKET_COUNT_PER_WORKSPACE = 10;

export const db = new PrismaClient({ adapter });

export const seed = async (): Promise<{ users: User[]; workspaces: Workspace[]; tickets: Ticket[] }> => {
  const users: User[] = [];

  const workspaces: Workspace[] = [];

  const tickets: Ticket[] = [];

  await db.user.deleteMany();

  const john = await createUser('john@gmail.com');

  const jane = await createUser('jane@gmail.com');

  const jim = await createUser('jim@gmail.com');

  users.push(john, jane, jim);

  for (const user of [john, jane, jim]) {
    const createdWorkspaces = Array.from({ length: WORKSPACE_COUNT_PER_USER }, () => ({
      id: v7(),
      name: faker.company.name(),
      ownerId: user.id,
      createdAt: new UTCDate(),
      updatedAt: new UTCDate(),
    }));

    await db.workspace.createMany({
      data: createdWorkspaces,
    });

    workspaces.push(...createdWorkspaces);
  }

  for (const workspace of workspaces) {
    const createdTickets = Array.from({ length: TICKET_COUNT_PER_WORKSPACE }, () => {
      const userIds = workspaces.filter((workspace) => workspace.id === workspace.id).map((workspace) => workspace.ownerId);

      const reporterId = faker.helpers.arrayElement(userIds);

      return {
        id: v7(),
        title: faker.word.words(2),
        description: faker.lorem.paragraph(),
        workspaceId: workspace.id,
        reporterId: reporterId,
        assigneeId: null,
        createdAt: new UTCDate(),
        updatedAt: new UTCDate(),
      };
    });

    await db.ticket.createMany({
      data: createdTickets,
    });

    tickets.push(...createdTickets);
  }

  return { users, workspaces, tickets };
};

const createUser = async (email: string) => {
  const userId = v7();

  const user = {
    id: userId,
    name: faker.person.fullName(),
    email: email,
    emailVerified: true,
    image: '',
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
  };

  await db.user.create({
    data: user,
  });

  const account = {
    id: v7(),
    userId: userId,
    accountId: userId,
    providerId: 'credential',
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    password:
      '90083d9fb64299c14f1728dc65a67124:ce6d2d63ddcd34d577a9a6d37687812b033272dcae0dd1b52fae855ec2a6e1bfed7e7dc518ca7e4382fac7a5ae5432fa3b12b3b0cb964cd9552c72f5b39c54bf',
    createdAt: new UTCDate(),
    updatedAt: new UTCDate(),
  };

  await db.account.create({
    data: account,
  });

  return user;
};
