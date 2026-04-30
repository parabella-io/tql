import { z } from 'zod';

/** Primary account used in manual / API tests (see `.env.example`). */
export const PRIMARY_TEST_USER_EMAIL = 'test@gmail.com';

export const seedConfigSchema = z.object({
  reset: z.boolean().default(false),
  /** When `reset` is true, allow wiping a non-localhost database (use with care). */
  allowRemoteDatabaseReset: z.boolean().default(false),
  fakerSeed: z.number().int().optional(),
  workspaceCount: z.number().int().min(1).default(2),
  extraMembersPerWorkspace: z.number().int().min(0).default(1),
  ticketListsPerWorkspace: z.number().int().min(1).default(3),
  ticketsPerList: z.number().int().min(0).default(4),
  commentsPerTicket: z.number().int().min(0).default(2),
  labelsPerWorkspace: z.number().int().min(0).default(3),
});

export type SeedConfig = z.infer<typeof seedConfigSchema>;

/** Default seed knobs — edit this object and run `pnpm db:seed`. */
export const DEFAULT_SEED_CONFIG: SeedConfig = seedConfigSchema.parse({
  reset: false,
  allowRemoteDatabaseReset: false,
  fakerSeed: undefined,
  workspaceCount: 2,
  extraMembersPerWorkspace: 50,
  ticketListsPerWorkspace: 3,
  ticketsPerList: 4,
  commentsPerTicket: 2,
  labelsPerWorkspace: 3,
});

export function createSeedConfig(overrides: Partial<SeedConfig>): SeedConfig {
  return seedConfigSchema.parse({ ...DEFAULT_SEED_CONFIG, ...overrides });
}

export function assertSafeDatabaseReset(databaseUrl: string, config: SeedConfig): void {
  if (!config.reset) return;

  const local = /localhost|127\.0\.0\.1/.test(databaseUrl);

  if (!local && !config.allowRemoteDatabaseReset) {
    throw new Error(
      'Refusing reset: DATABASE_URL does not look local. Set allowRemoteDatabaseReset: true in prisma/seed/config.ts to override.',
    );
  }
}
