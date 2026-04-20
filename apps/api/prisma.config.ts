import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: 'postgresql://postgres:password@localhost:5432/tql',
  },
});
