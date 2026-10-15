import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createReadingStore } from '@/stores/reading-store';

import { memoryStorage } from './fixtures';

test('progress survives reload, scopes stay separate and reset can be undone', async () => {
  const storage = memoryStorage();
  const first = createReadingStore(storage);
  await first.persist.rehydrate();
  first.getState().increment('dzikir:pagi:1:1');
  first.getState().increment('dzikir:pagi:1:1');
  first.getState().increment('dzikir:petang:1:1');
  const reloaded = createReadingStore(storage);
  await reloaded.persist.rehydrate();
  assert.equal(reloaded.getState().counts['dzikir:pagi:1:1'], 2);
  assert.equal(reloaded.getState().counts['dzikir:petang:1:1'], 1);
  reloaded.getState().reset('dzikir:pagi:1:1');
  assert.equal(reloaded.getState().counts['dzikir:pagi:1:1'], 0);
  reloaded.getState().undoReset('dzikir:pagi:1:1');
  assert.equal(reloaded.getState().counts['dzikir:pagi:1:1'], 2);
  assert.equal(reloaded.getState().counts['dzikir:petang:1:1'], 1);
});

test('malformed persisted progress falls back safely', async () => {
  const storage = memoryStorage();
  storage.setItem(
    'muslim-reading',
    JSON.stringify({ state: { counts: { bad: -4 } }, version: 0 })
  );
  const store = createReadingStore(storage);
  await store.persist.rehydrate();
  assert.deepEqual(store.getState().counts, {});
});
