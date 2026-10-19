import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createAladhanHandler } from '@/services/aladhan-proxy';

import { prayerResponse } from './fixtures';

const baseUrl = 'https://aladhan.example/v1/';
const start = Date.parse('2026-10-13T01:00:00Z');
const city = { mode: 'city', city: 'Bogor', country: 'ID', date: '2026-10-13' };
function request(values: Record<string, string> = city, signal?: AbortSignal) {
  return new Request(
    `https://muslim.example/api/prayer-times?${new URLSearchParams(values)}`,
    { signal }
  );
}

test('prayer proxy rejects invalid dates and parameters without contacting Aladhan', async () => {
  let calls = 0;
  const handle = createAladhanHandler({
    baseUrl,
    fetcher: async () => {
      calls++;
      return Response.json(prayerResponse());
    },
  });
  for (const values of [
    {},
    { ...city, mode: 'calendar' },
    { ...city, city: ' ' },
    { ...city, country: '' },
    { ...city, city: 'x'.repeat(121) },
    { ...city, date: '' },
    { ...city, date: '2026-02-30' },
    { ...city, date: '2026-02-29' },
    { ...city, date: '../timings' },
    { ...city, date: '2026-13-01' },
    { ...city, method: '11.5' },
    { ...city, method: '-1' },
    { ...city, method: 'Infinity' },
    { ...city, method: '' },
    { ...city, adjustment: '0.5' },
    { ...city, adjustment: 'NaN' },
    { ...city, mode: 'coordinates', latitude: '91', longitude: '0' },
    { ...city, mode: 'coordinates', latitude: '0', longitude: '-181' },
    { ...city, mode: 'coordinates', latitude: '', longitude: '0' },
  ]) {
    const response = await handle(request(values));
    assert.equal(response.status, 400, JSON.stringify(values));
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
  }
  assert.equal(calls, 0);
});

test('prayer proxy uses a fixed provider with only supported, normalized parameters', async () => {
  const urls: URL[] = [];
  const handle = createAladhanHandler({
    baseUrl,
    fetcher: async (input, options) => {
      const url = new URL(String(input));
      urls.push(url);
      assert.equal(options?.cache, 'no-store');
      const response = prayerResponse('29');
      response.data!.date.gregorian = {
        day: '29',
        month: { number: 2, en: 'February' },
        year: '2028',
      };
      return Response.json(response);
    },
  });
  assert.equal(
    (
      await handle(
        request({
          ...city,
          date: '2028-02-29',
          city: ' Bogor ',
          country: ' id ',
          url: 'https://other.example',
          tune: '123',
        })
      )
    ).status,
    200
  );
  assert.equal(urls[0].origin, 'https://aladhan.example');
  assert.equal(urls[0].pathname, '/v1/timingsByCity/29-02-2028');
  assert.deepEqual(Object.fromEntries(urls[0].searchParams), {
    city: 'bogor',
    country: 'ID',
    method: '11',
    adjustment: '0',
  });
  assert.equal(
    (
      await handle(
        request({
          mode: 'coordinates',
          latitude: '0',
          longitude: '180',
          date: '2028-02-29',
          method: '3',
          adjustment: '-1',
        })
      )
    ).status,
    200
  );
  assert.equal(urls[1].pathname, '/v1/timings/29-02-2028');
  assert.deepEqual(Object.fromEntries(urls[1].searchParams), {
    latitude: '0',
    longitude: '180',
    method: '3',
    adjustment: '-1',
  });
});

test('identical prayer requests share work even if one caller cancels, then expire after one hour', async () => {
  let time = start;
  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>(resolve => {
    release = resolve;
  });
  let upstreamSignal: AbortSignal | null | undefined;
  const handle = createAladhanHandler({
    baseUrl,
    now: () => time,
    fetcher: async (_input, options) => {
      calls++;
      upstreamSignal = options?.signal;
      await gate;
      return Response.json(prayerResponse());
    },
  });
  const controller = new AbortController();
  const first = handle(request(city, controller.signal));
  const second = handle(
    request({
      ...city,
      city: ' bogor ',
      country: 'id',
      method: '11',
      adjustment: '0',
    })
  );
  assert.equal(calls, 1);
  controller.abort();
  assert.equal(upstreamSignal?.aborted, false);
  release();
  const responses = await Promise.all([first, second]);
  assert.ok(responses.every(response => response.status === 200));
  assert.deepEqual(await responses[0].json(), await responses[1].json());
  time += 3_599_999;
  const cached = await handle(request());
  assert.equal(cached.status, 200);
  assert.equal(cached.headers.get('X-Prayer-Fetched-At'), String(start));
  assert.equal(cached.headers.get('Cache-Control'), 'no-store');
  assert.equal(calls, 1);
  time++;
  const refreshed = await handle(request());
  assert.equal(refreshed.status, 200);
  assert.equal(refreshed.headers.get('X-Prayer-Fetched-At'), String(time));
  assert.equal(calls, 2);
});

test('prayer cache never mixes dates, locations, coordinates, methods or adjustments', async () => {
  let calls = 0;
  let time = start;
  const handle = createAladhanHandler({
    baseUrl,
    now: () => time,
    fetcher: async input => {
      const url = new URL(String(input));
      const response = prayerResponse(
        url.pathname.split('/').at(-1)!.slice(0, 2)
      );
      response.data!.timings.Fajr = `04:${String(++calls).padStart(2, '0')}`;
      return Response.json(response);
    },
  });
  const coordinate = {
    mode: 'coordinates',
    latitude: '-6.6',
    longitude: '106.8',
    date: '2026-10-13',
  };
  const variants = [
    city,
    { ...city, date: '2026-10-14' },
    { ...city, city: 'Bandung' },
    { ...city, country: 'US' },
    { ...city, method: '3' },
    { ...city, adjustment: '1' },
    coordinate,
    { ...coordinate, latitude: '-6.7' },
    { ...coordinate, longitude: '106.9' },
  ];
  for (let pass = 0; pass < 2; pass++) {
    for (const [index, values] of variants.entries()) {
      time += 1000;
      const response = await handle(request(values));
      assert.equal(response.status, 200);
      assert.equal(
        (await response.json()).data.timings.Fajr,
        `04:0${index + 1}`
      );
    }
  }
  assert.equal(calls, variants.length);
});

test('invalid or failed upstream responses cannot enter the shared cache', async () => {
  const wrongZone = prayerResponse();
  wrongZone.data!.meta.timezone = 'Invalid/Zone';
  for (const invalid of [
    () => Response.json(prayerResponse('14')),
    () => Response.json(wrongZone),
    () => Response.json({ code: 200, status: 'OK', data: null }),
    () => Response.json({ ...prayerResponse(), code: 500 }),
    () => new Response('not json'),
    () => new Response(null, { status: 500 }),
    () => {
      throw new DOMException('Timeout', 'TimeoutError');
    },
  ]) {
    let calls = 0;
    const handle = createAladhanHandler({
      baseUrl,
      fetcher: async () =>
        ++calls === 1 ? invalid() : Response.json(prayerResponse()),
    });
    assert.equal((await handle(request())).status, 502);
    assert.equal((await handle(request())).status, 200);
    assert.equal(calls, 2);
  }
});

test('provider cooldown is shared across locations while valid cached schedules remain available', async () => {
  for (const retryAfter of [
    '20',
    new Date(start + 20_000).toUTCString(),
    'invalid',
  ]) {
    let calls = 0;
    let time = start;
    const handle = createAladhanHandler({
      baseUrl,
      now: () => time,
      fetcher: async () => {
        calls++;
        return calls === 2
          ? new Response(null, {
              status: 429,
              headers: { 'Retry-After': retryAfter },
            })
          : Response.json(prayerResponse());
      },
    });
    assert.equal((await handle(request())).status, 200);
    const other = { ...city, city: 'Medan' };
    const limited = await handle(request(other));
    assert.equal(limited.status, 429);
    const seconds = retryAfter === 'invalid' ? 30 : 20;
    assert.equal(limited.headers.get('Retry-After'), String(seconds));
    assert.equal((await handle(request())).status, 200);
    time += seconds * 1000 - 1;
    assert.equal(
      (await handle(request({ ...city, city: 'Jakarta' }))).status,
      429
    );
    assert.equal(calls, 2);
    time++;
    assert.equal((await handle(request(other))).status, 200);
    assert.equal(calls, 3);
  }
});

test('uncached prayer traffic has a shared sliding rate limit without blocking cache hits', async () => {
  let time = start;
  let calls = 0;
  const handle = createAladhanHandler({
    baseUrl,
    now: () => time,
    fetcher: async () => {
      calls++;
      return Response.json(prayerResponse());
    },
  });
  for (let index = 0; index < 8; index++) {
    assert.equal(
      (await handle(request({ ...city, city: `city-${index}` }))).status,
      200
    );
  }
  const limited = await handle(request());
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '1');
  assert.equal(
    (await handle(request({ ...city, city: 'city-0' }))).status,
    200
  );
  time += 999;
  assert.equal((await handle(request())).status, 429);
  assert.equal(calls, 8);
  time++;
  assert.equal((await handle(request())).status, 200);
  assert.equal(calls, 9);
});

test('shared prayer cache evicts old entries at its capacity', async () => {
  let calls = 0;
  let time = start;
  const handle = createAladhanHandler({
    baseUrl,
    now: () => time,
    fetcher: async () => {
      calls++;
      return Response.json(prayerResponse());
    },
  });
  for (let index = 0; index < 257; index++) {
    time += 1000;
    assert.equal(
      (await handle(request({ ...city, city: `city-${index}` }))).status,
      200
    );
  }
  assert.equal(
    (await handle(request({ ...city, city: 'city-256' }))).status,
    200
  );
  assert.equal(calls, 257);
  assert.equal(
    (await handle(request({ ...city, city: 'city-0' }))).status,
    200
  );
  assert.equal(calls, 258);
});
