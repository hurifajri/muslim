import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readPrayerCache, writePrayerCache } from '@/lib/prayer-cache';
import { fetchAladhanTimings } from '@/services/aladhan';

import { memoryStorage, prayerResponse } from './fixtures';

const city = { mode: 'city', city: 'bogor', country: 'ID' } as const;

test('server cache age is preserved when saving and reading the offline copy', async t => {
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: memoryStorage() },
    configurable: true,
  });
  const fetchedAt = Date.parse('2026-10-13T01:00:00Z');
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json(prayerResponse(), {
      headers: { 'X-Prayer-Fetched-At': String(fetchedAt) },
    })
  );
  const online = await fetchAladhanTimings(city, '2026-10-13');
  assert.equal(online.fetchedAt, fetchedAt);
  assert.equal(online.cached, false);
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, { status: 429 })
  );
  const offline = await fetchAladhanTimings(city, '2026-10-13');
  assert.equal(offline.fetchedAt, fetchedAt);
  assert.equal(offline.cached, true);
  assert.deepEqual(offline.response, online.response);
});

test('offline fallback preserves original date and never leaks another city', async t => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('offline');
  });
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: memoryStorage() },
    configurable: true,
  });
  await writePrayerCache(city, prayerResponse(), 100);
  const cached = await fetchAladhanTimings(city, '2026-10-14');
  assert.equal(cached.cached, true);
  assert.equal(cached.response.data?.date.gregorian.day, '13');
  assert.equal(
    await readPrayerCache({ ...city, city: 'bandung' }, '2026-10-14'),
    undefined
  );
});

test('wrong API date is rejected, cancellation never falls back', async t => {
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: memoryStorage() },
    configurable: true,
  });
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json(prayerResponse())
  );
  await assert.rejects(fetchAladhanTimings(city, '2026-10-14'), /tanggal/);
  await writePrayerCache(city, prayerResponse(), 100);
  t.mock.method(globalThis, 'fetch', async () => {
    throw new DOMException('Cancelled', 'AbortError');
  });
  await assert.rejects(
    fetchAladhanTimings(city, '2026-10-13', AbortSignal.abort()),
    /Cancelled/
  );
});

test('saving today and tomorrow together retains both dated entries', async () => {
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: memoryStorage() },
    configurable: true,
  });
  await Promise.all([
    writePrayerCache(city, prayerResponse('13'), 100),
    writePrayerCache(city, prayerResponse('14'), 101),
  ]);
  assert.equal(
    (await readPrayerCache(city, '2026-10-13'))?.response.data?.date.gregorian
      .day,
    '13'
  );
  assert.equal(
    (await readPrayerCache(city, '2026-10-14'))?.response.data?.date.gregorian
      .day,
    '14'
  );
});
