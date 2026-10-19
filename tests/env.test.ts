import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const providerEnv = {
  ALADHAN_API_URL: 'https://gateway.example/prayer',
  NOMINATIM_API_URL: 'https://gateway.example/location',
};

function loadEnv(overrides: Record<string, string> = {}, browser = false) {
  const variables = { ...process.env };
  for (const key of [
    'ALADHAN_API_URL',
    'NOMINATIM_API_URL',
    'NEXT_PUBLIC_ALADHAN_API_URL',
    'NEXT_PUBLIC_NOMINATIM_API_URL',
  ])
    delete variables[key];
  return spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    ${browser ? 'globalThis.window = {};' : ''}
    const { env } = await import('./src/env.ts');
    console.log(JSON.stringify({ aladhan: env.ALADHAN_API_URL, nominatim: env.NOMINATIM_API_URL }));
  `,
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...variables,
        NEXT_PUBLIC_APP_URL: 'https://muslim.example',
        ...overrides,
      },
    }
  );
}

test('provider env reads explicit private URLs', () => {
  const result = loadEnv({
    ...providerEnv,
    NEXT_PUBLIC_ALADHAN_API_URL: 'https://legacy.example/prayer',
    NEXT_PUBLIC_NOMINATIM_API_URL: 'https://legacy.example/location',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    aladhan: providerEnv.ALADHAN_API_URL,
    nominatim: providerEnv.NOMINATIM_API_URL,
  });
});

test('both provider URLs are required without defaults or legacy fallbacks', () => {
  const cases: Record<string, string>[] = [
    {},
    { ALADHAN_API_URL: providerEnv.ALADHAN_API_URL },
    { NOMINATIM_API_URL: providerEnv.NOMINATIM_API_URL },
    {
      NEXT_PUBLIC_ALADHAN_API_URL: 'https://legacy.example/prayer',
      NEXT_PUBLIC_NOMINATIM_API_URL: 'https://legacy.example/location',
    },
  ];
  for (const variables of cases) {
    const result = loadEnv(variables);
    assert.notEqual(result.status, 0, JSON.stringify(variables));
    assert.match(result.stderr, /Invalid environment variables/);
  }
});

test('empty or invalid provider URLs fail validation before a request', () => {
  for (const key of Object.keys(providerEnv)) {
    for (const value of ['', 'not-a-url']) {
      const result = loadEnv({ ...providerEnv, [key]: value });
      assert.notEqual(result.status, 0, key);
      assert.match(result.stderr, /Invalid environment variables/);
    }
  }
});

test('provider URLs cannot be accessed through env in the browser', () => {
  const result = loadEnv(providerEnv, true);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /server-side environment variable on the client/);
});
