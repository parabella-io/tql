import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './database';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const db = new PrismaClient({ adapter });
