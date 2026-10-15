import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import test from 'node:test';

test('browser runner explains a missing CLI without attempting cleanup', () => {
  const result = spawnSync(process.execPath, ['scripts/test-browser.mjs'], {
    encoding: 'utf8',
    env: {
      ...process.env,
      AGENT_BROWSER_BIN: join(process.cwd(), 'missing-browser-for-regression'),
    },
    timeout: 10_000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /pnpm install/);
  assert.match(result.stderr, /AGENT_BROWSER_BIN/);
  assert.doesNotMatch(result.stderr, /Browser cleanup/);
});

test('browser runner explains an unavailable server before opening Chrome', () => {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    TEST_BASE_URL: 'http://127.0.0.1:0',
  };
  delete env.AGENT_BROWSER_BIN;
  const result = spawnSync(process.execPath, ['scripts/test-browser.mjs'], {
    encoding: 'utf8',
    env,
    timeout: 15_000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Server belum siap/);
  assert.match(result.stderr, /pnpm start/);
  assert.doesNotMatch(result.stderr, /Browser cleanup/);
});
