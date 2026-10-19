// @ts-check
// Additional interaction regressions share the main runner's isolated session.
/** @param {import('./browser-test-types').BrowserTestContext} context */
export function testConsistency({ browser, check, waitFor, base }) {
  const locationGeometry = `(() => {
    const input = document.getElementById('city-search');
    const dialog = input.closest('[role=dialog]');
    const bounds = dialog.getBoundingClientRect();
    const field = input.closest('[data-slot=input-group]').getBoundingClientRect();
    const save = Array.from(dialog.querySelectorAll('button')).find(button => button.textContent === 'Simpan').getBoundingClientRect();
    return [bounds.top, bounds.height, field.top, save.top];
  })()`;
  const rememberLocationLayout = () =>
    check(`window.__locationGeometry = ${locationGeometry};`);
  const checkLocationStable = () =>
    check(`const geometry = ${locationGeometry};
      if (geometry.some((value, index) => Math.abs(value - window.__locationGeometry[index]) > 1)) throw Error('Location popup changed the modal layout: ' + JSON.stringify({ before: window.__locationGeometry, after: geometry }));`);
  const checkLocationLayout = () =>
    check(`const input = document.getElementById('city-search');
      const body = input.closest('form').parentElement;
      const group = input.closest('[data-slot=input-group]');
      if (body.scrollWidth > body.clientWidth || group.scrollWidth > group.clientWidth) throw Error('Location form overflows horizontally');
      const bounds = body.getBoundingClientRect();
      const field = group.getBoundingClientRect();
      if (field.left - bounds.left < 3 || bounds.right - field.right < 3) throw Error('Location focus ring is clipped');
      const dialog = input.closest('[role=dialog]').getBoundingClientRect();
      const save = Array.from(input.closest('[role=dialog]').querySelectorAll('button')).find(button => button.textContent === 'Simpan').getBoundingClientRect();
      if (dialog.top < 0 || dialog.bottom > innerHeight + 1 || save.bottom > innerHeight) throw Error('Location controls extend beyond the viewport');
      const form = input.closest('form').getBoundingClientRect();
      const geolocation = body.querySelector(':scope > button').getBoundingClientRect();
      if (geolocation.top - form.bottom > 16) throw Error('Location form retains unnecessary empty space');`);
  /** @param {string | null} container */
  const checkLocationAttribution = container =>
    check(`const links = document.querySelectorAll('[role=dialog] a[href="https://www.openstreetmap.org/copyright"]');
      const container = ${JSON.stringify(container)};
      if (!container) {
        if (links.length) throw Error('Unexpected location attribution');
      } else {
        if (links.length !== 1 || !links[0].closest(container)) throw Error('Location attribution is missing from its result');
        if (links[0].parentElement.textContent !== 'Data lokasi © OpenStreetMap contributors') throw Error('Location attribution copy changed');
      }`);
  const checkLocationPopup = () => {
    waitFor(`(() => {
      const popup = document.getElementById('city-search-results');
      return Boolean(popup) && popup.getAnimations().every(animation => animation.playState === 'finished');
    })()`);
    check(`const popup = document.getElementById('city-search-results');
      const input = document.getElementById('city-search');
      const bounds = popup.getBoundingClientRect();
      const anchor = input.closest('[data-slot=input-group]').getBoundingClientRect();
      if (!['absolute', 'fixed'].includes(getComputedStyle(popup.closest('[data-slot=combobox-positioner]')).position)) throw Error('Location results are still in the dialog layout');
      if (bounds.top < 0 || bounds.bottom > innerHeight || bounds.left < 0 || bounds.right > innerWidth || Math.abs(bounds.width - anchor.width) > 1) throw Error('Location popup does not fit its anchor/viewport');
      const attribution = popup.querySelector('a[href="https://www.openstreetmap.org/copyright"]').getBoundingClientRect();
      if (attribution.bottom > bounds.bottom || attribution.top < bounds.top) throw Error('Scrollable results hid attribution');`);
    checkLocationLayout();
  };
  const openLocation = () => {
    browser('find', 'role', 'button', 'click', '--name', 'Buka dialog lokasi');
    waitFor(`(() => {
      const dialog = document.querySelector('[role=dialog]');
      return dialog?.querySelector('#city-search') &&
        dialog.getBoundingClientRect().bottom <= innerHeight + 1 &&
        dialog.getAnimations().every(animation => animation.playState === 'finished');
    })()`);
    checkLocationLayout();
    checkLocationAttribution(null);
  };

  for (const [width, height, city] of [
    ['320', '480', 'Bogor'],
    ['390', '844', 'Bogor'],
    ['1024', '844', 'Jakarta'],
  ]) {
    browser('set', 'viewport', width, height);
    browser('open', base);
    waitFor(`Boolean(document.querySelector('a[href*="#bacaan-doa-"]'))`);
    check(`window.__locationRequests = [];
      window.__locationFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = new URL(input, location.href);
        const item = (city, id) => ({
          place_id: id, display_name: city + ', Indonesia',
          address: { city, country: 'Indonesia', country_code: 'id' },
          namedetails: city === 'Special Capital Region of Jakarta' ? { '_place_name:id': 'Jakarta' } : {}
        });
        if (url.pathname === '/api/location/reverse') {
          window.__reverseLocationRequested = true;
          return Response.json(item('Bandung', 30));
        }
        if (url.pathname !== '/api/location/search') return window.__locationFetch(input, init);
        const query = url.searchParams.get('q');
        window.__locationRequests.push(query);
        if (query === 'lama') return new Promise(resolve => {
          init.signal.addEventListener('abort', () => { window.__locationAborted = true; });
          window.__resolveOldLocation = () => resolve(Response.json([item('Lama', 10)]));
        });
        if (window.__failLocation) return new Response('', { status: 502 });
        if (query === 'kosong') return Response.json([]);
        if (query === 'pilihan') return Response.json([item('Bogor', 21), item('Jakarta', 22), item('Medan', 23)]);
        if (query === 'banyak') return Response.json(['Bogor', 'Jakarta', 'Medan', 'Sukabumi', 'Tasikmalaya', 'Bandar Lampung'].map((city, index) => item(city, index + 40)));
        const city = query.toLowerCase() === 'jakarta' ? 'Special Capital Region of Jakarta' : query;
        return Response.json([item(city, 1), item(city, 2)]);
      };`);
    openLocation();
    browser('fill', '#city-search', city);
    // Longer than the removed debounce: typing/focus/reconnect must not search.
    check(`window.dispatchEvent(new Event('focus'));
      window.dispatchEvent(new Event('online'));
      await new Promise(resolve => setTimeout(resolve, 650));
      if (window.__locationRequests.length) throw Error('Typing or focus searched automatically');`);
    rememberLocationLayout();
    browser('press', 'Enter');
    waitFor(
      `document.querySelectorAll('#city-search-results [role=option]').length === 1`
    );
    checkLocationPopup();
    checkLocationStable();
    checkLocationAttribution('#city-search-results');
    check(`const input = document.getElementById('city-search');
      const list = document.querySelector('#city-search-results [role=listbox]');
      if (document.activeElement !== input || input.getAttribute('role') !== 'combobox') throw Error('Combobox lost its input semantics/focus');
      if (!list || input.getAttribute('aria-controls') !== list.id || input.getAttribute('aria-expanded') !== 'true') throw Error('Combobox is not linked to its result list');
      if (list.querySelector('[role=radio], [aria-pressed], button')) throw Error('Combobox results must use native options');`);
    // Search and result controls retain their accessible names.
    browser('find', 'role', 'combobox', 'click', '--name', 'Lokasi', '--exact');
    check(`if (window.__locationRequests.length !== 1) throw Error('Search submitted more than once');
      if (document.querySelector('#city-search-results [role=option]').textContent !== '${city}, Indonesia') throw Error('City label is not normalized');`);
    if (width === '390') {
      browser('press', 'ArrowDown');
      browser('press', 'Enter');
    } else {
      browser(
        'find',
        'role',
        'option',
        'click',
        '--name',
        `${city}, Indonesia`
      );
    }
    waitFor(
      `document.getElementById('city-search')?.value === '${city}, Indonesia' && !document.getElementById('city-search-results')`
    );
    checkLocationLayout();
    checkLocationAttribution(null);
    check(
      `if (document.activeElement.id !== 'city-search') throw Error('Selection lost keyboard focus');`
    );
    browser('find', 'role', 'button', 'click', '--name', 'Simpan', '--exact');
    waitFor(`!document.querySelector('[role=dialog]')`);
    openLocation();
    check(`if (document.getElementById('city-search').value !== '${city}, Indonesia') throw Error('Saved city label changed on reopen');
      if (window.__locationRequests.length !== 1) throw Error('Selection triggered another search');`);

    browser('fill', '#city-search', 'banyak');
    rememberLocationLayout();
    browser('press', 'Enter');
    waitFor(
      `document.querySelectorAll('#city-search-results [role=option]').length === 6`
    );
    checkLocationPopup();
    checkLocationStable();
    check(`const viewport = document.querySelector('#city-search-results [role=listbox]');
      if (viewport.scrollHeight <= viewport.clientHeight) throw Error('Long result list has no independent scroll area');
      window.__requestsBeforeDismiss = window.__locationRequests.length;`);
    for (let index = 0; index < 6; index++) browser('press', 'ArrowDown');
    check(`const viewport = document.querySelector('#city-search-results [role=listbox]');
      const bounds = viewport.getBoundingClientRect();
      const input = document.getElementById('city-search');
      const active = document.getElementById(input.getAttribute('aria-activedescendant'));
      const focused = active.getBoundingClientRect();
      if (document.activeElement !== input || active.textContent !== 'Bandar Lampung, Indonesia' || viewport.scrollTop <= 0 || focused.top < bounds.top || focused.bottom > bounds.bottom) throw Error('Combobox navigation did not reveal the last result');`);
    browser('press', 'Escape');
    waitFor(`!document.getElementById('city-search-results')`);
    checkLocationStable();
    check(
      `if (!document.getElementById('city-search') || document.activeElement.id !== 'city-search') throw Error('Escape closed the parent dialog or lost input focus');`
    );
    browser('press', 'ArrowDown');
    waitFor(
      `Boolean(document.getElementById(document.getElementById('city-search').getAttribute('aria-activedescendant')))`
    );
    checkLocationPopup();
    checkLocationStable();
    check(
      `if (window.__locationRequests.length !== window.__requestsBeforeDismiss) throw Error('Reopening results refetched the search');`
    );
    const outsidePopup = JSON.parse(
      browser(
        'eval',
        `(() => {
        const bounds = document.getElementById('location-dialog').getBoundingClientRect();
        return { x: Math.round(bounds.left + 8), y: Math.round(bounds.top + 32) };
      })()`
      )
    );
    browser('mouse', 'move', String(outsidePopup.x), String(outsidePopup.y));
    browser('mouse', 'down');
    browser('mouse', 'up');
    waitFor(`!document.getElementById('city-search-results')`);
    checkLocationLayout();
    checkLocationStable();

    browser('fill', '#city-search', 'pilihan');
    rememberLocationLayout();
    browser('press', 'Enter');
    waitFor(
      `document.querySelectorAll('#city-search-results [role=option]').length === 3`
    );
    checkLocationPopup();
    checkLocationStable();
    checkLocationAttribution('#city-search-results');
    browser('press', 'ArrowDown');
    browser('press', 'ArrowDown');
    check(`const input = document.getElementById('city-search');
      if (document.activeElement !== input || document.getElementById(input.getAttribute('aria-activedescendant'))?.textContent !== 'Jakarta, Indonesia') throw Error('ArrowDown did not highlight the next option');`);
    browser('press', 'ArrowUp');
    check(`const input = document.getElementById('city-search');
      if (document.getElementById(input.getAttribute('aria-activedescendant'))?.textContent !== 'Bogor, Indonesia') throw Error('ArrowUp did not highlight the previous option');`);
    browser('press', 'ArrowDown');
    browser('press', 'ArrowDown');
    check(`const input = document.getElementById('city-search');
      if (input.value !== 'pilihan' || document.activeElement !== input || document.getElementById(input.getAttribute('aria-activedescendant'))?.textContent !== 'Medan, Indonesia') throw Error('Combobox navigation selected before confirmation');`);
    browser('press', 'Enter');
    waitFor(
      `document.getElementById('city-search').value === 'Medan, Indonesia' && !document.getElementById('city-search-results')`
    );
    checkLocationAttribution(null);

    browser('fill', '#city-search', 'lama');
    browser('press', 'Enter');
    waitFor(`typeof window.__resolveOldLocation === 'function'`);
    checkLocationLayout();
    browser('fill', '#city-search', 'Medan');
    waitFor(`window.__locationAborted === true`);
    check(`window.__resolveOldLocation();
      await new Promise(resolve => setTimeout(resolve, 50));
      if (document.getElementById('city-search').value !== 'Medan' || document.querySelector('#city-search-results [role=option]')) throw Error('Obsolete response replaced the current query');
      window.__failLocation = true;`);
    browser('press', 'Enter');
    waitFor(
      `document.querySelector('[role=dialog] [role=alert]')?.textContent.includes('Pencarian gagal')`
    );
    checkLocationLayout();
    checkLocationAttribution(null);
    check('window.__failLocation = false');
    browser(
      'find',
      'role',
      'button',
      'click',
      '--name',
      'Coba lagi',
      '--exact'
    );
    waitFor(
      `document.querySelector('#city-search-results [role=option]')?.textContent === 'Medan, Indonesia'`
    );
    checkLocationPopup();
    browser('press', 'Escape');
    waitFor(`!document.getElementById('city-search-results')`);
    checkLocationLayout();
    browser('press', 'Escape');
    waitFor(`!document.querySelector('[role=dialog]')`);
    openLocation();
    browser('fill', '#city-search', 'kosong');
    browser('press', 'Enter');
    waitFor(
      `document.querySelector('[role=dialog] output')?.textContent.includes('Kota tidak ditemukan')`
    );
    checkLocationLayout();
    checkLocationAttribution(null);
    check(`window.__originalGeolocation = navigator.geolocation;
      Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {
        getCurrentPosition(success, error) {
          window.__resolveGeolocation = () => success({ coords: { latitude: -6.91, longitude: 107.61 } });
          window.__rejectGeolocation = () => error({ code: 1 });
        }
      } });`);
    browser('find', 'role', 'button', 'click', '--name', 'Gunakan lokasi saya');
    waitFor(
      `Boolean(window.__rejectGeolocation) && document.querySelector('#location-dialog').textContent.includes('Mendeteksi lokasi')`
    );
    checkLocationLayout();
    check(`window.__rejectGeolocation()`);
    waitFor(
      `document.querySelector('#location-dialog').textContent.includes('Izin')`
    );
    checkLocationLayout();
    browser('find', 'role', 'button', 'click', '--name', 'Gunakan lokasi saya');
    check(`window.__resolveGeolocation()`);
    waitFor(
      `document.getElementById('city-search').value === 'Bandung, Indonesia'`
    );
    check(`if (!window.__reverseLocationRequested) throw Error('Geolocation skipped reverse geocoding');
      Object.defineProperty(navigator, 'geolocation', { configurable: true, value: window.__originalGeolocation });`);
    checkLocationLayout();
    checkLocationAttribution('form');
    browser('find', 'role', 'button', 'click', '--name', 'Simpan', '--exact');
    waitFor(`!document.querySelector('[role=dialog]')`);
    openLocation();
    check(
      `if (document.getElementById('city-search').value !== 'Bandung, Indonesia') throw Error('Geolocated city was not saved');`
    );
    browser('find', 'role', 'button', 'click', '--name', 'Hapus pencarian');
    waitFor(`document.getElementById('city-search').value === ''`);
    checkLocationAttribution(null);
    browser('press', 'Escape');
    waitFor(`!document.querySelector('[role=dialog]')`);
    check('window.fetch = window.__locationFetch');

    browser('open', `${base}/dzikir/pagi`);
    waitFor(
      `document.querySelector('#bacaan-dzikir-2-1 button[aria-pressed]')?.disabled === false`
    );
    browser('click', '#bacaan-dzikir-2-1 button[data-size=lg]');
    waitFor(
      `document.querySelector('[role=dialog] p')?.textContent.length > 10`
    );
    check(`const paragraphs = Array.from(document.querySelectorAll('[role=dialog] p'));
      if (paragraphs.length < 2 || !paragraphs.some(p => p.textContent.includes('['))) throw Error('Benefits or source missing');
      if (document.documentElement.scrollWidth > innerWidth) throw Error('Benefits overflow horizontally');`);
    browser('press', 'Escape');
    waitFor(`!document.querySelector('[role=dialog]')`);
  }
  console.log(
    'PASS: stable location dialog, accessible combobox and scrollable options, result attribution, geolocation, manual search, keyboard/pointer selection, Escape, cancellation, retry, empty results and shared benefits on mobile/desktop'
  );

  browser('open', `${base}/bacaan?tab=favorit`);
  waitFor(
    `document.querySelector('[role=radio][aria-checked=true]')?.textContent === 'Favorit'`
  );
  browser('find', 'role', 'radio', 'click', '--name', 'Favorit', '--exact');
  check(
    `if (document.querySelectorAll('[role=radio][aria-checked=true]').length !== 1) throw Error('Filter lost its selection');`
  );
  browser('press', 'ArrowLeft');
  browser('press', 'Space');
  waitFor(
    `document.querySelector('[role=radio][aria-checked=true]')?.textContent === 'Semua bacaan' && !location.search.includes('favorit')`
  );
  console.log(
    'PASS: reading filter always has one selection and supports keyboard navigation'
  );

  for (const width of ['320', '1024']) {
    browser('set', 'viewport', width, '740');
    browser('open', `${base}/bacaan`);
    browser('find', 'role', 'button', 'click', '--name', 'Buka pengaturan');
    waitFor(`document.querySelector('[data-slot=scroll-area-viewport]') &&
      document.querySelector('[role=dialog]').getAnimations().every(animation => animation.playState === 'finished')`);
    for (const theme of ['Melati (Putih)', 'Dahlia Hitam (Hitam)']) {
      browser('find', 'role', 'button', 'click', '--name', theme, '--exact');
      check(`const viewport = document.querySelector('[data-slot=scroll-area-viewport]');
        if (viewport.scrollHeight <= viewport.clientHeight) throw Error('Settings are not scrollable');
        viewport.focus();`);
      browser('press', 'PageDown');
      waitFor(`document.querySelector('[data-slot=scroll-area-viewport]').scrollTop > 0 &&
        Boolean(document.querySelector('[data-slot=scroll-area-scrollbar][data-state=visible]'))`);
      check(`const thumb = document.querySelector('[data-slot=scroll-area-thumb]');
        const color = getComputedStyle(thumb).backgroundColor;
        if (color === 'rgba(0, 0, 0, 0)') throw Error('Scrollbar thumb is invisible');
        if (window.__previousThumbColor === color) throw Error('Scrollbar did not follow the active theme');
        window.__previousThumbColor = color;
        const dialog = document.querySelector('[role=dialog]').getBoundingClientRect();
        const footer = document.querySelector('[data-slot=sheet-footer]').getBoundingClientRect();
        if (dialog.bottom > innerHeight + 1 || footer.bottom > innerHeight + 1 || document.documentElement.scrollWidth > innerWidth) throw Error('Settings overflow the viewport');`);
      waitFor(
        `!document.querySelector('[data-slot=scroll-area-scrollbar][data-state=visible]')`
      );
      check(`const viewport = document.querySelector('[data-slot=scroll-area-viewport]');
        viewport.scrollTop = 0;`);
    }
    browser('press', 'Escape');
    waitFor(`!document.querySelector('[role=dialog]')`);
  }
  console.log(
    'PASS: themed settings scrollbar supports keyboard scrolling and hides when idle on mobile/desktop'
  );

  browser('open', base);
  waitFor(`Boolean(document.querySelector('a[href*="#bacaan-doa-"]'))`);
  check(`localStorage.removeItem('installPromptDismissedAt')`);
  // Start with no cached dismissal before denying storage. An existing in-memory
  // dismissal intentionally remains effective when storage becomes unavailable.
  browser('open', `${base}/dzikir/pagi`);
  waitFor(`document.querySelector('button[aria-pressed]')?.disabled === false`);
  check(`window.__installErrors = [];
    window.addEventListener('error', event => window.__installErrors.push(event.message));
    window.addEventListener('unhandledrejection', event => window.__installErrors.push(String(event.reason)));
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('Storage denied', 'SecurityError'); } });
    const event = new Event('beforeinstallprompt');
    event.prompt = async () => { throw new Error('Install rejected'); };
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(event);`);
  waitFor(
    `Array.from(document.querySelectorAll('button')).some(button => button.textContent.includes('Pasang')) || window.__installErrors.length > 0`
  );
  check(
    `if (window.__installErrors.length) throw Error('Storage-denied install prompt crashed: ' + window.__installErrors);`
  );
  browser('find', 'role', 'button', 'click', '--name', 'Pasang', '--exact');
  waitFor(`!document.body.textContent.includes('Pasang aplikasi Muslim')`);
  check(`if (window.__installErrors.length) throw Error('Installation rejection was not handled');
    const event = new Event('beforeinstallprompt');
    event.prompt = async () => {};
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(event);`);
  waitFor(`document.body.textContent.includes('Pasang aplikasi Muslim')`);
  browser('find', 'role', 'button', 'click', '--name', 'Tutup', '--exact');
  waitFor(`!document.body.textContent.includes('Pasang aplikasi Muslim')`);
  check(
    `if (window.__installErrors.length) throw Error('Dismissing with storage denied crashed');`
  );
  browser('reload');
  console.log(
    'PASS: install prompt tolerates denied storage and rejected installation'
  );
}
