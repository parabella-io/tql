import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { generateSchema } from '@parabella-io/tql-server';

import { schema } from '../src/schema/index';

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(here, '../generated/schema.ts');

const result = generateSchema({ schema, outputPath });

const { renderMs, diffMs, writeMs, totalMs } = result.timings;
console.log(
  `[generateSchema] ${result.reason} (${totalMs.toFixed(2)}ms total — render ${renderMs.toFixed(2)}ms, diff ${diffMs.toFixed(2)}ms, write ${writeMs.toFixed(2)}ms)`,
);
