import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createNominatimHandler } from '@/services/nominatim-proxy';

const result = {
  place_id: 1,
  display_name: 'Bogor, Indonesia',
  address: { city: 'Bogor', country_code: 'id' },
};
const request = (query: string) =>
  new Request(`https://muslim.example/api/location/search?q=${query}`);

test('location proxy validates input before contacting the provider', async () => {
  const handler = createNominatimHandler({
    baseUrl: 'https://nominatim.example',
    userAgent: 'Muslim test',
    fetcher: async () => {
      throw Error('Unexpected upstream request');
    },
  });
  assert.equal((await handler(request('a'), 'search')).status, 400);
  assert.equal((await handler(request('Bogor'), 'unknown')).status, 400);
  assert.equal(
    (
      await handler(
        new Request('https://muslim.example/api/location/reverse?lat=91&lon=0'),
        'reverse'
      )
    ).status,
    400
  );
});

test('location proxy deduplicates, caches and limits search and reverse together', async () => {
  let now = 0;
  const calls: string[] = [];
  const handler = createNominatimHandler({
    baseUrl: 'https://nominatim.example',
    userAgent: 'Muslim test',
    now: () => now,
    fetcher: async (input, init) => {
      const url = new URL(String(input));
      calls.push(url.href);
      assert.equal(new Headers(init?.headers).get('User-Agent'), 'Muslim test');
      assert.equal(url.searchParams.get('accept-language'), 'id,en');
      return Response.json(url.pathname === '/search' ? [result] : result);
    },
  });
  const responses = await Promise.all([
    handler(request('Bogor'), 'search'),
    handler(request('Bogor'), 'search'),
  ]);
  assert.deepEqual(
    responses.map(response => response.status),
    [200, 200]
  );
  assert.equal(calls.length, 1);
  assert.equal((await handler(request('bogor'), 'search')).status, 200);
  const reverse = new Request(
    'https://muslim.example/api/location/reverse?lat=-6.6&lon=106.8'
  );
  const limited = await handler(reverse, 'reverse');
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '1');
  now = 1000;
  assert.equal((await handler(reverse, 'reverse')).status, 200);
  assert.equal(calls.length, 2);
  now = 3_600_001;
  assert.equal((await handler(request('Bogor'), 'search')).status, 200);
  assert.equal(calls.length, 3);
});

test('location proxy does not cache failures and respects upstream cooldown', async () => {
  let now = 0;
  let calls = 0;
  const handler = createNominatimHandler({
    baseUrl: 'https://nominatim.example',
    userAgent: 'Muslim test',
    now: () => now,
    fetcher: async () => {
      calls++;
      return calls === 1
        ? new Response(null, { status: 429, headers: { 'Retry-After': '30' } })
        : Response.json([result]);
    },
  });
  assert.equal((await handler(request('Bogor'), 'search')).status, 429);
  now = 1000;
  assert.equal(
    (await handler(request('Bogor'), 'search')).headers.get('Retry-After'),
    '29'
  );
  assert.equal(calls, 1);
  now = 30_000;
  assert.equal((await handler(request('Bogor'), 'search')).status, 200);
  assert.equal(calls, 2);
});
