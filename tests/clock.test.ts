import assert from 'node:assert/strict';
import { test } from 'node:test';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { LocationTime } from '@/app/_components/location-time';
import { useGregDate } from '@/hooks/use-greg-date';
import { observeClock } from '@/hooks/use-now';

test('server and cached HTML contain placeholders rather than server time', () => {
  function Clock() {
    const { gregTime, gregSeconds } = useGregDate();
    return createElement('span', {}, `${gregTime}:${gregSeconds}`);
  }
  assert.equal(
    renderToStaticMarkup(createElement(Clock)),
    '<span>--:--:--</span>'
  );
});

test('selected city clock stays hidden until it can be compared with device time', () => {
  const html = renderToStaticMarkup(
    createElement(
      QueryClientProvider,
      { client: new QueryClient() },
      createElement(LocationTime, {
        city: 'Tokyo',
        country: 'JP',
        timeZone: 'Asia/Tokyo',
      })
    )
  );
  assert.equal(html, '');
});

test('clock resynchronizes after tick, pageshow and hidden-tab midnight; cleanup stops updates', t => {
  t.mock.timers.enable({
    apis: ['Date', 'setTimeout', 'setInterval'],
    now: new Date('2026-10-13T13:14:30Z'),
  });
  const browser = Object.assign(new EventTarget(), {
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
  });
  const document = Object.assign(new EventTarget(), {
    visibilityState: 'visible',
  });
  Object.defineProperty(globalThis, 'window', {
    value: browser,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'document', {
    value: document,
    configurable: true,
  });
  t.after(() => {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'document');
  });
  const times: number[] = [];
  const cleanup = observeClock(now => times.push(now.getTime()));
  t.mock.timers.tick(0);
  assert.equal(times.at(-1), Date.parse('2026-10-13T13:14:30Z'));
  t.mock.timers.tick(1000);
  assert.equal(times.at(-1), Date.parse('2026-10-13T13:14:31Z'));
  t.mock.timers.setTime(Date.parse('2026-10-14T00:00:00Z'));
  browser.dispatchEvent(new Event('pageshow'));
  assert.equal(times.at(-1), Date.parse('2026-10-14T00:00:00Z'));
  t.mock.timers.setTime(Date.parse('2026-10-14T03:00:00Z'));
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(times.at(-1), Date.parse('2026-10-14T03:00:00Z'));
  cleanup();
  const count = times.length;
  t.mock.timers.tick(2000);
  browser.dispatchEvent(new Event('pageshow'));
  assert.equal(times.length, count);
});
