import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createSafeStorage } from '@/lib/safe-storage';
import { createReadingStore } from '@/stores/reading-store';

import { memoryStorage } from './fixtures';

test('blocked browser storage keeps edits in memory and reports each affected key once', () => {
  const storage = createSafeStorage(() => {
    throw new Error('Storage denied');
  });
  let changes = 0;
  const unsubscribe = storage.subscribe(() => changes++);
  assert.equal(storage.getItem('muslim-reading'), null);
  storage.setItem('muslim-reading', 'one');
  storage.setItem('muslim-reading', 'two');
  assert.equal(storage.getItem('muslim-reading'), 'two');
  assert.equal(storage.isTemporary('muslim-reading'), true);
  assert.equal(changes, 1);
  storage.removeItem('muslim-reading');
  assert.equal(storage.getItem('muslim-reading'), null);
  unsubscribe();
  storage.setItem('muslim-settings', 'settings');
  assert.equal(changes, 1);
});

test('failed write retains the new value without overwriting durable data on later recovery', () => {
  const durable = memoryStorage();
  durable.setItem('key', 'old');
  let fail = true;
  const storage = createSafeStorage(() => ({
    ...durable,
    setItem: (key, value) => {
      if (fail) throw new Error('Quota exceeded');
      durable.setItem(key, value);
    },
  }));
  assert.equal(storage.getItem('key'), 'old');
  storage.setItem('key', 'new');
  assert.equal(storage.getItem('key'), 'new');
  assert.equal(durable.getItem('key'), 'old');
  fail = false;
  durable.setItem('key', 'another tab');
  storage.setItem('key', 'session edit');
  assert.equal(storage.getItem('key'), 'session edit');
  assert.equal(durable.getItem('key'), 'another tab');
});

test('temporary reading state survives action rehydration and focus refresh', async () => {
  const storage = createSafeStorage(() => {
    throw new Error('Storage denied');
  });
  const store = createReadingStore(storage);
  await store.persist.rehydrate();
  await store.getState().increment('dzikir:pagi:1:1', 3);
  await store.getState().increment('dzikir:pagi:1:1', 3);
  await store.getState().toggleFavorite('doa:2:2');
  await store.persist.rehydrate();
  assert.equal(store.getState().counts['dzikir:pagi:1:1'], 2);
  assert.equal(store.getState().favorites['doa:2:2'], true);
  assert.equal(store.getState().hydrated, true);
});

test('healthy storage observes deletion from another tab and failed removal stays temporary', () => {
  const durable = memoryStorage();
  let fail = false;
  const storage = createSafeStorage(() => ({
    ...durable,
    removeItem: key => {
      if (fail) throw new Error('Storage denied');
      durable.removeItem(key);
    },
  }));
  storage.setItem('key', 'value');
  durable.removeItem('key');
  assert.equal(storage.getItem('key'), null);
  storage.setItem('key', 'value');
  fail = true;
  storage.removeItem('key');
  assert.equal(storage.getItem('key'), null);
  assert.equal(storage.isTemporary('key'), true);
});
