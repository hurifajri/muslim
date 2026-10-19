// @ts-check
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

/** @param {import('./browser-test-types').BrowserTestContext} context */
export async function testPrayerProxy({ browser, check, waitFor, base }) {
  const { outputFiles } = await build({
    entryPoints: [
      fileURLToPath(new URL('../tests/fixtures.ts', import.meta.url)),
    ],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
  });
  /** @type {typeof import('../tests/fixtures')} */
  const { prayerResponse } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
  );
  const installFixture = () =>
    check(`
    const original = window.fetch.bind(window);
    window.__prayerRequests = [];
    window.__restorePrayerFetch = () => { window.fetch = original; };
    window.__prayerFetchedAt = Date.now() - 300_000;
    window.fetch = async (input, options) => {
      const url = new URL(input instanceof Request ? input.url : String(input), location.href);
      if (url.hostname === 'api.aladhan.com') throw Error('Prayer request bypassed the proxy');
      if (url.pathname !== '/api/prayer-times') return original(input, options);
      window.__prayerRequests.push(Object.fromEntries(url.searchParams));
      const [year, month, day] = url.searchParams.get('date').split('-');
      const response = ${JSON.stringify(prayerResponse())};
      response.data.date.gregorian = { day, month: { number: Number(month), en: 'Fixture' }, year };
      return Response.json(response, { headers: { 'X-Prayer-Fetched-At': String(window.__prayerFetchedAt) } });
    };
  `);
  const card = 'document.querySelector(\'section[aria-label="Jadwal salat"]\')';
  browser('open', base);
  waitFor('Boolean(navigator.serviceWorker.controller)');
  // Let the initial unmocked request settle before testing reconnect/refetch.
  waitFor(`${card} && !${card}.textContent.includes('Memuat jadwal salat')`);
  check(`localStorage.removeItem('muslim-prayer-schedules')`);
  installFixture();
  browser('set', 'offline', 'on');
  waitFor('!navigator.onLine');
  browser('set', 'offline', 'off');
  waitFor(
    `window.__prayerRequests.length > 0 && JSON.parse(localStorage.getItem('muslim-prayer-schedules') || '[]').some(entry => entry.fetchedAt === window.__prayerFetchedAt)`
  );
  check(`
    for (const request of window.__prayerRequests) {
      if (request.mode !== 'city' || !request.city || !request.country || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.date)) throw Error('Internal prayer request lost its location/date');
    }
    window.__restorePrayerFetch();
    const cache = await caches.open('apis');
    await cache.put('/api/prayer-times?date=2000-01-01', Response.json({ staleWorkerCopy: true }));
  `);
  browser('set', 'offline', 'on');
  browser('reload');
  waitFor(`${card}?.textContent.includes('Menampilkan jadwal tersimpan.')`);
  check(`
    let response;
    try { response = await fetch('/api/prayer-times?date=2000-01-01'); } catch {}
    if (response?.ok) throw Error('Service worker supplied a stale prayer API response');
    await (await caches.open('apis')).delete('/api/prayer-times?date=2000-01-01');
    const entries = JSON.parse(localStorage.getItem('muslim-prayer-schedules'));
    const today = ${card}.querySelector('p time[datetime]').getAttribute('datetime');
    const entry = entries.find(item => {
      const date = item.response.data.date.gregorian;
      return [date.year, String(date.month.number).padStart(2, '0'), date.day.padStart(2, '0')].join('-') === today;
    });
    const previous = new Date(today + 'T00:00:00Z');
    previous.setUTCDate(previous.getUTCDate() - 2);
    entry.response.data.date.gregorian = { day: String(previous.getUTCDate()), month: { number: previous.getUTCMonth() + 1, en: 'Fixture' }, year: String(previous.getUTCFullYear()) };
    localStorage.setItem('muslim-prayer-schedules', JSON.stringify([entry]));
  `);
  browser('reload');
  waitFor(
    `${card}?.textContent.includes('Jadwal tersimpan ini bukan untuk hari ini.')`
  );
  check(
    `if (${card}.textContent.includes(' dalam ')) throw Error('An old schedule produced a current countdown');`
  );
  installFixture();
  check('window.__prayerReconnectMarker = true');
  browser('set', 'offline', 'off');
  waitFor(
    `window.__prayerRequests.length > 0 && !${card}?.textContent.includes('Jadwal tersimpan ini bukan untuk hari ini.')`
  );
  check(
    `if (!window.__prayerReconnectMarker) throw Error('Prayer reconnect reloaded the document'); window.__restorePrayerFetch();`
  );
  console.log(
    'PASS: prayer proxy requests, dated offline fallback, service-worker exclusion and reconnect'
  );
}
