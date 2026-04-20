import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  root: 'test',
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    typecheck: {
      tsconfig: 'tsconfig.json',
    },
    setupFiles: ['./test/setup.ts'],
  },
  cacheDir: '../node_modules/.vitest',
});
