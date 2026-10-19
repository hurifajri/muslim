import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createReadingStore } from '@/stores/reading-store';
import { createSettingsStore } from '@/stores/settings-store';

import { memoryStorage } from './fixtures';

test('stale tabs keep independent favorites and apply removals to current data', async () => {
  const storage = memoryStorage();
  const first = createReadingStore(storage);
  const second = createReadingStore(storage);
  await first.persist.rehydrate();
  await second.persist.rehydrate();
  await first.getState().toggleFavorite('doa:2:2');
  await second.getState().toggleFavorite('dzikir:2:1');
  await first.persist.rehydrate();
  assert.deepEqual(first.getState().favorites, {
    'doa:2:2': true,
    'dzikir:2:1': true,
  });
  await first.getState().toggleFavorite('doa:2:2');
  await second.getState().increment('dzikir:pagi:1:1', 3);
  await second.persist.rehydrate();
  assert.deepEqual(second.getState().favorites, { 'dzikir:2:1': true });
});

test('concurrent increments read latest counts and respect targets across stores', async () => {
  const storage = memoryStorage();
  const first = createReadingStore(storage);
  const second = createReadingStore(storage);
  await first.persist.rehydrate();
  await second.persist.rehydrate();
  const id = 'dzikir:pagi:1:1';
  await Promise.all([
    first.getState().increment(id, 3),
    second.getState().increment(id, 3),
    first.getState().increment(id, 3),
    second.getState().increment(id, 3),
  ]);
  await first.persist.rehydrate();
  assert.equal(first.getState().counts[id], 3);
});

test('remote changes invalidate old undo without overwriting another session', async () => {
  const storage = memoryStorage();
  const first = createReadingStore(storage);
  const second = createReadingStore(storage);
  await first.persist.rehydrate();
  await second.persist.rehydrate();
  const morning = 'dzikir:pagi:1:1';
  const evening = 'dzikir:petang:1:1';
  await first.getState().increment(morning, 3);
  await first.getState().increment(morning, 3);
  await first.getState().resetSession('dzikir:pagi');
  await second.getState().increment(morning, 3);
  await second.getState().increment(evening, 3);
  await first.getState().undoSession('dzikir:pagi');
  assert.equal(first.getState().counts[morning], 1);
  assert.equal(first.getState().counts[evening], 1);
  assert.equal(first.getState().undoSessions['dzikir:pagi'], undefined);
});

test('stale settings updates retain preferences changed by another tab', async () => {
  const storage = memoryStorage();
  const first = createSettingsStore(undefined, storage);
  const second = createSettingsStore(undefined, storage);
  await first.persist.rehydrate();
  await second.persist.rehydrate();
  await first.getState().setSettings('clickSound', true);
  await second.getState().setFontSize('arabic', 30);
  await first.persist.rehydrate();
  assert.equal(first.getState().settings.clickSound, true);
  assert.equal(first.getState().fontSizes.arabic, 30);
});
