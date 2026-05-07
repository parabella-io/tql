import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const packages = ['packages/server', 'packages/client'];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

run('pnpm', ['turbo', 'build:package', '--filter=@parabella-io/tql-server', '--filter=@parabella-io/tql-client']);

for (const packagePath of packages) {
  run('pnpm', ['publish', '--access', 'public', '--no-git-checks'], {
    cwd: join(process.cwd(), packagePath),
  });
}
