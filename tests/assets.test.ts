import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { test } from 'node:test';

test('all 12 poster backgrounds fit the offline cache budget', () => {
  const files = readdirSync('public/bgs');
  assert.equal(files.length, 12);
  let total = 0;
  for (const file of files) {
    const bytes = statSync(`public/bgs/${file}`).size;
    assert.ok(bytes < 2 * 1024 * 1024, `${file} exceeds precache limit`);
    total += bytes;
  }
  assert.ok(total < 4 * 1024 * 1024, 'background pack exceeds 4 MiB');
});
