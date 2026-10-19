import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createReadingStore } from '@/stores/reading-store';

import { memoryStorage } from './fixtures';

test('progress survives reload, scopes stay separate and reset can be undone', async () => {
  const storage = memoryStorage();
  const first = createReadingStore(storage);
  await first.persist.rehydrate();
  await first.getState().increment('dzikir:pagi:1:1');
  await first.getState().increment('dzikir:pagi:1:1');
  await first.getState().increment('dzikir:petang:1:1');
  const reloaded = createReadingStore(storage);
  await reloaded.persist.rehydrate();
  assert.equal(reloaded.getState().counts['dzikir:pagi:1:1'], 2);
  assert.equal(reloaded.getState().counts['dzikir:petang:1:1'], 1);
  await reloaded.getState().reset('dzikir:pagi:1:1');
  assert.equal(reloaded.getState().counts['dzikir:pagi:1:1'], 0);
  await reloaded.getState().undoReset('dzikir:pagi:1:1');
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

test('truncated JSON does not leave reading controls disabled and the next edit repairs it', async () => {
  const storage = memoryStorage();
  storage.setItem('muslim-reading', '{"state":');
  const store = createReadingStore(storage);
  await store.persist.rehydrate();
  assert.equal(store.getState().hydrated, true);
  await store.getState().increment('dzikir:pagi:1:1', 3);
  assert.equal(store.getState().counts['dzikir:pagi:1:1'], 1);
  const reloaded = createReadingStore(storage);
  await reloaded.persist.rehydrate();
  assert.equal(reloaded.getState().counts['dzikir:pagi:1:1'], 1);
});
