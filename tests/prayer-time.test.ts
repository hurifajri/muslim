import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  dateInTimeZone,
  formatScheduleDate,
  scheduleDate,
} from '@/lib/prayer-time';
import { getAladhanUrl } from '@/services/aladhan';

test('selected location date crosses midnight independently of UTC/device', () => {
  const instant = new Date('2026-10-13T17:00:01Z');
  assert.equal(dateInTimeZone(instant, 'Asia/Jakarta'), '2026-10-14');
  assert.equal(dateInTimeZone(instant, 'America/New_York'), '2026-10-13');
  assert.equal(
    dateInTimeZone(new Date('2026-12-31T17:00:00Z'), 'Asia/Jakarta'),
    '2027-01-01'
  );
});

test('city and coordinates request the internal endpoint with an explicit date', () => {
  const city = new URL(
    getAladhanUrl(
      { mode: 'city', city: 'New York', country: 'US' },
      '2026-10-14'
    ),
    'https://muslim.example'
  );
  assert.equal(city.origin, 'https://muslim.example');
  assert.equal(city.pathname, '/api/prayer-times');
  assert.equal(city.searchParams.get('mode'), 'city');
  assert.equal(city.searchParams.get('date'), '2026-10-14');
  assert.equal(city.searchParams.get('city'), 'New York');
  assert.equal(city.searchParams.get('method'), '11');
  const gps = new URL(
    getAladhanUrl(
      { mode: 'coordinates', latitude: -6.6, longitude: 106.8 },
      '2026-10-14'
    ),
    'https://muslim.example'
  );
  assert.equal(gps.origin, 'https://muslim.example');
  assert.equal(gps.pathname, '/api/prayer-times');
  assert.equal(gps.searchParams.get('mode'), 'coordinates');
  assert.equal(gps.searchParams.get('date'), '2026-10-14');
  assert.equal(gps.searchParams.get('latitude'), '-6.6');
});

test('API date normalizes without depending on the server timezone', () => {
  assert.equal(
    scheduleDate({ day: '4', month: { number: 2 }, year: '2026' }),
    '2026-02-04'
  );
});

test('schedule date is readable without shifting the calendar day', () => {
  assert.equal(formatScheduleDate('2026-10-14'), '14 Okt 2026');
  assert.equal(formatScheduleDate('2027-01-01'), '1 Jan 2027');
});
