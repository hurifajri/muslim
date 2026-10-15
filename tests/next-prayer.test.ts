import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getNextPrayer, nextDate, prayerInstant } from '@/lib/prayer-time';

test('next prayer uses location timezone, then tomorrow Subuh after Isya', () => {
  const today = {
    date: '2026-10-13',
    timeZone: 'Asia/Jakarta',
    prayingTimes: [
      { id: 0, name: 'Subuh', time: '04:30' },
      { id: 4, name: 'Isya', time: '19:00' },
    ],
  };
  const tomorrow = {
    ...today,
    date: nextDate(today.date),
    prayingTimes: [{ id: 0, name: 'Subuh', time: '04:29' }],
  };
  assert.equal(
    getNextPrayer(new Date('2026-10-13T11:59:00Z'), [today])?.name,
    'Isya'
  );
  const afterIsya = getNextPrayer(new Date('2026-10-13T13:14:00Z'), [
    today,
    tomorrow,
  ]);
  assert.equal(afterIsya?.name, 'Subuh');
  assert.equal(
    new Date(afterIsya!.at).toISOString(),
    '2026-10-13T21:29:00.000Z'
  );
  assert.equal(
    getNextPrayer(new Date('2026-10-14T03:00:00Z'), [today]),
    undefined
  );
});

test('timezone conversion handles DST and year rollover without adding 24 hours', () => {
  assert.equal(
    new Date(
      prayerInstant('2026-03-29', '04:00', 'Europe/London')!
    ).toISOString(),
    '2026-03-29T03:00:00.000Z'
  );
  assert.equal(nextDate('2026-12-31'), '2027-01-01');
  assert.equal(
    prayerInstant('2026-10-13', 'invalid', 'Asia/Jakarta'),
    undefined
  );
  assert.equal(prayerInstant('2026-10-13', '25:01', 'Asia/Jakarta'), undefined);
});
