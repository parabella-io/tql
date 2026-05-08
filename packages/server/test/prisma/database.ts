import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './client/index.js';

export { PrismaClient };

export const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: ':memory:' }),
  });
};
