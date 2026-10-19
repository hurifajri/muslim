import { spawnSync } from 'node:child_process';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { build } from 'esbuild';

const directory = await mkdtemp(join(tmpdir(), 'muslim-tests-'));
try {
  const files = (await readdir('tests')).filter(name =>
    name.endsWith('.test.ts')
  );
  await build({
    entryPoints: files.map(name => `tests/${name}`),
    outdir: directory,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    loader: { '.css': 'empty' },
    define: {
      'process.env.NEXT_PUBLIC_APP_URL': '"https://muslim.example"',
      'process.env.ALADHAN_API_URL': '"https://api.aladhan.com/v1"',
      'process.env.NOMINATIM_API_URL': '"https://nominatim.openstreetmap.org"',
    },
    logLevel: 'warning',
  });
  const result = spawnSync(
    process.execPath,
    [
      '--test',
      ...files.map(name => join(directory, name.replace(/\.ts$/, '.js'))),
    ],
    { stdio: 'inherit' }
  );
  process.exitCode = result.status ?? 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}
