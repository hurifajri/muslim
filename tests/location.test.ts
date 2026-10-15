import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  formatLocationLabel,
  formatLocationTime,
  getDifferentLocationTime,
} from '@/lib/location-display';
import { parseLocationCookie } from '@/lib/parse-location-cookie';
import {
  fetchReverseGeocode,
  fetchSearchLocations,
} from '@/services/nominatim';
import { createLocationStore } from '@/stores/location-store';

test('location updates city and country atomically and clears old timezone', () => {
  const store = createLocationStore();
  const seen: string[] = [];
  store.subscribe(state => seen.push(`${state.city}/${state.country}`));
  store.getState().setLocation({ city: 'Tokyo', country: 'JP' });
  assert.deepEqual(seen, ['Tokyo/JP']);
  assert.equal(store.getState().timeZone, undefined);
  store.getState().setTimeZone('bogor', 'ID', 'Asia/Jakarta');
  assert.equal(store.getState().timeZone, undefined);
});

test('legacy location cookie loads but invalid values are rejected', () => {
  assert.equal(
    parseLocationCookie(
      JSON.stringify({ state: { city: 'Tokyo', country: 'JP' } })
    ).city,
    'Tokyo'
  );
  assert.equal(
    parseLocationCookie(JSON.stringify({ state: { city: 5, country: 'JP' } }))
      .city,
    'bogor'
  );
  assert.equal(
    parseLocationCookie(
      JSON.stringify({
        state: { city: 'Tokyo', country: 'JP', timeZone: 'not/a/zone' },
      })
    ).city,
    'bogor'
  );
});

test('search errors remain errors and AbortSignal reaches the request', async t => {
  const abort = new AbortController();
  let received: AbortSignal | null | undefined;
  t.mock.method(
    globalThis,
    'fetch',
    async (_url: unknown, init?: RequestInit) => {
      received = init?.signal;
      return new Response('', { status: 503 });
    }
  );
  await assert.rejects(fetchSearchLocations('Tokyo', abort.signal), /503/);
  assert.equal(received, abort.signal);
});

test('search removes duplicate city/country results and uses the common Jakarta name', async t => {
  t.mock.method(
    globalThis,
    'fetch',
    async (url: string, init?: RequestInit) => {
      const params = new URL(url).searchParams;
      assert.equal(params.get('featureType'), 'city');
      assert.equal(params.get('namedetails'), '1');
      assert.equal(params.get('accept-language'), 'id,en');
      assert.equal(new Headers(init?.headers).has('Accept-Language'), false);
      return Response.json([
        {
          place_id: 1,
          display_name: 'Bogor, Jawa Barat, Indonesia',
          address: { city: 'Bogor', country: 'Indonesia', country_code: 'id' },
        },
        {
          place_id: 2,
          display_name: 'Bogor, Indonesia',
          address: { city: 'bogor', country: 'Indonesia', country_code: 'id' },
        },
        {
          place_id: 3,
          display_name: 'Special Capital Region of Jakarta, Indonesia',
          address: {
            city: 'Special Capital Region of Jakarta',
            country_code: 'id',
          },
          namedetails: { short_name: 'JKT', '_place_name:id': 'Jakarta' },
        },
        {
          place_id: 4,
          display_name: 'Bogor, another country',
          address: { city: 'Bogor', country_code: 'jp' },
        },
        { place_id: 5, display_name: 'Incomplete result', address: {} },
      ]);
    }
  );
  const results = await fetchSearchLocations('bogor');
  assert.deepEqual(
    results.map(result => result.displayName),
    ['Bogor, Indonesia', 'Jakarta, Indonesia', 'Bogor, Jepang']
  );
  assert.equal(results[0].placeId, 1);
  assert.equal(results[1].city, 'Jakarta');
});

test('geolocation uses city-level lookup and the same compact label as search', async t => {
  const controller = new AbortController();
  t.mock.method(
    globalThis,
    'fetch',
    async (url: string, init?: RequestInit) => {
      const params = new URL(url).searchParams;
      assert.equal(params.get('zoom'), '10');
      assert.equal(params.get('namedetails'), '1');
      assert.equal(params.get('accept-language'), 'id,en');
      assert.equal(new Headers(init?.headers).has('Accept-Language'), false);
      assert.equal(init?.signal, controller.signal);
      return Response.json({
        place_id: 1,
        display_name: 'Daerah Khusus Ibukota Jakarta, Indonesia',
        address: { city: 'Daerah Khusus Ibukota Jakarta', country_code: 'id' },
        namedetails: { short_name: 'JKT', '_place_name:id': 'Jakarta' },
      });
    }
  );
  const result = await fetchReverseGeocode(-6.2, 106.8, controller.signal);
  assert.equal(result?.displayName, 'Jakarta, Indonesia');
  assert.equal(result?.country, 'Indonesia');
});

test('saved location keeps its label and timezone after reopening a legacy lowercase location', t => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const document = { cookie: '' };
  Object.defineProperty(globalThis, 'document', {
    value: document,
    configurable: true,
  });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, 'document', original);
    else Reflect.deleteProperty(globalThis, 'document');
  });
  assert.equal(formatLocationLabel('bogor', 'ID'), 'Bogor, Indonesia');
  const store = createLocationStore();
  store.getState().setLocation({ city: 'Bogor', country: 'ID' });
  const raw = document.cookie.split(';')[0].slice('muslim-location='.length);
  const restored = parseLocationCookie(raw);
  assert.equal(restored.city, 'Bogor');
  assert.equal(restored.timeZone, 'Asia/Jakarta');
  assert.equal(
    formatLocationLabel(restored.city, restored.country),
    'Bogor, Indonesia'
  );
  assert.equal(
    formatLocationLabel('New York', 'US'),
    'New York, Amerika Serikat'
  );
  assert.equal(
    formatLocationLabel('McAllen', 'US'),
    'McAllen, Amerika Serikat'
  );
});

test('selected city time follows its own timezone, including DST', () => {
  const now = new Date('2026-10-14T13:14:30Z');
  assert.equal(formatLocationTime(now, 'Asia/Jakarta'), '20.14.30');
  assert.equal(formatLocationTime(now, 'Asia/Tokyo'), '22.14.30');
  assert.equal(formatLocationTime(now, 'America/New_York'), '09.14.30');
  assert.equal(
    formatLocationTime(new Date('2026-12-14T13:14:30Z'), 'America/New_York'),
    '08.14.30'
  );
});

test('card clock can format hours, minutes and seconds with colons', () => {
  assert.equal(
    formatLocationTime(new Date('2026-10-14T13:14:30Z'), 'Asia/Tokyo', 'en-GB'),
    '22:14:30'
  );
});

test('card hides local time until hydrated and when city time matches the device', () => {
  const now = new Date('2026-10-14T13:14:30Z');
  assert.equal(getDifferentLocationTime(null, 'Asia/Tokyo'), null);
  assert.equal(getDifferentLocationTime(now, undefined, 'Asia/Jakarta'), null);
  assert.equal(
    getDifferentLocationTime(now, 'Asia/Jakarta', 'Asia/Jakarta'),
    null
  );
  assert.equal(
    getDifferentLocationTime(now, 'Asia/Bangkok', 'Asia/Jakarta'),
    null
  );
});

test('card shows differing city time and follows seasonal offset changes', () => {
  const now = new Date('2026-10-14T13:14:30Z');
  assert.equal(
    getDifferentLocationTime(now, 'Asia/Tokyo', 'Asia/Jakarta'),
    '22:14:30'
  );
  assert.equal(
    getDifferentLocationTime(now, 'Europe/London', 'UTC'),
    '14:14:30'
  );
  assert.equal(
    getDifferentLocationTime(
      new Date('2026-12-14T13:14:30Z'),
      'Europe/London',
      'UTC'
    ),
    null
  );
  assert.equal(
    getDifferentLocationTime(
      new Date('2026-10-14T16:14:30Z'),
      'Asia/Tokyo',
      'Asia/Jakarta'
    ),
    '01:14:30'
  );
});
