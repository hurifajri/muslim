import assert from 'node:assert/strict';
import { test } from 'node:test';

import { doas } from '@/data/doas';
import { dzikirs } from '@/data/dzikirs';
import { readings, searchReadings } from '@/lib/readings';
import { getSessionProgress } from '@/lib/reading-session';
import { createReadingStore } from '@/stores/reading-store';
import { createSettingsStore } from '@/stores/settings-store';

import { memoryStorage } from './fixtures';

test('reading IDs and links are unique and searchable in both languages', () => {
  assert.equal(
    new Set(readings.map(reading => reading.id)).size,
    readings.length
  );
  assert.equal(
    new Set(readings.map(reading => reading.href)).size,
    readings.length
  );
  assert.ok(searchReadings('ampunan').length > 0);
  assert.ok(searchReadings('رَبَّنَا').length > 0);
  assert.ok(searchReadings('rabbanaa').length > 0);
  assert.equal(searchReadings('no-such-reading-xyz').length, 0);
});

test('numeric repetition targets match notes and completion identifies next reading', () => {
  for (const item of [...doas, ...dzikirs])
    if (item.note)
      assert.equal(item.repetitions, Number(item.note.match(/^\d+/)?.[0]));
  const items = dzikirs.filter(item => item.categories.includes('pagi'));
  const first = getSessionProgress(items, 'dzikir:pagi', {});
  assert.ok(first.next);
  const counts = Object.fromEntries(
    first.entries.map(entry => [entry.id, entry.target])
  );
  const done = getSessionProgress(items, 'dzikir:pagi', counts);
  assert.equal(done.completed, done.total);
  assert.equal(done.next, undefined);
});

test('favorites persist and session reset/undo affects only chosen scope', async () => {
  const storage = memoryStorage();
  const store = createReadingStore(storage);
  await store.persist.rehydrate();
  store.getState().toggleFavorite('doa:1:1');
  store.getState().increment('dzikir:pagi:2:1', 1);
  store.getState().increment('dzikir:pagi:2:1', 1);
  store.getState().increment('dzikir:petang:2:1', 1);
  assert.equal(store.getState().counts['dzikir:pagi:2:1'], 1);
  store.getState().resetSession('dzikir:pagi');
  assert.equal(store.getState().counts['dzikir:pagi:2:1'], 0);
  assert.equal(store.getState().counts['dzikir:petang:2:1'], 1);
  store.getState().undoSession('dzikir:pagi');
  assert.equal(store.getState().counts['dzikir:pagi:2:1'], 1);
  const reloaded = createReadingStore(storage);
  await reloaded.persist.rehydrate();
  assert.equal(reloaded.getState().favorites['doa:1:1'], true);
});

test('old settings retain preferences and acquire independent bounded font sizes', async () => {
  const storage = memoryStorage();
  storage.setItem(
    'muslim-settings',
    JSON.stringify({
      state: { settings: { counter: false, clickSound: true } },
      version: 0,
    })
  );
  const store = createSettingsStore(undefined, storage);
  await store.persist.rehydrate();
  assert.equal(store.getState().settings.counter, false);
  assert.equal(store.getState().settings.clickSound, true);
  assert.equal(store.getState().fontSizes.arabic, 24);
  store.getState().setFontSize('arabic', 1000);
  assert.equal(store.getState().fontSizes.arabic, 48);
  assert.equal(store.getState().fontSizes.translation, 16);
  const reloaded = createSettingsStore(undefined, storage);
  await reloaded.persist.rehydrate();
  assert.equal(reloaded.getState().fontSizes.arabic, 48);
});
