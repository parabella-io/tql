import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const version = process.argv[2];

const packages = [
  'apps/api/package.json',
  'apps/app/package.json',
  'apps/docs/package.json',
  'apps/e2e/package.json',
  'packages/server/package.json',
  'packages/client/package.json',
  'packages/ts-config/package.json',
  'package.json',
];

if (!version) {
  throw new Error('Usage: pnpm release:version <version>');
}

for (const packagePath of packages) {
  const absolutePath = join(process.cwd(), packagePath);

  const packageJson = JSON.parse(await readFile(absolutePath, 'utf8'));

  packageJson.version = version;

  await writeFile(absolutePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}
