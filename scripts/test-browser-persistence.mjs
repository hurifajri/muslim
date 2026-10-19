// @ts-check
/** @param {import('./browser-test-types').BrowserTestContext} context */
export function testPersistence({ browser, check, waitFor, base }) {
  const reading = '#bacaan-dzikir-3-1';
  const increment = `${reading} button[aria-label="Tambah hitungan"]`;
  const count = `document.querySelector('${reading} output')?.textContent`;
  /** @param {number} id */
  const favorite = id => `#bacaan-dzikir-${id}-1 button[aria-pressed]`;
  /** @param {number} id */
  const isFavorite = id =>
    `document.querySelector('${favorite(id)}')?.getAttribute('aria-pressed') === 'true'`;
  /** @param {number} id */
  const clickFavorite = id => {
    check(
      `document.querySelector('${favorite(id)}').scrollIntoView({ block: 'center' })`
    );
    browser('click', favorite(id));
  };
  const ready = () =>
    waitFor(`document.querySelector('${favorite(2)}')?.disabled === false`);
  const openSettings = () => {
    browser('find', 'role', 'button', 'click', '--name', 'Buka pengaturan');
    waitFor(
      `document.getElementById('font-arabic') && document.querySelector('[role=dialog]').getAnimations().every(animation => animation.playState === 'finished')`
    );
  };
  const clear = () =>
    check(`localStorage.removeItem('muslim-reading');
    localStorage.removeItem('muslim-settings'); window.dispatchEvent(new Event('focus'));`);
  const tabs = [];
  try {
    // The preceding install test intentionally cannot persist its dismissal.
    // Keep the browser's real install banner out of this interaction fixture.
    check(
      `localStorage.setItem('installPromptDismissedAt', String(Date.now()))`
    );
    browser('tab', 'new', '--label', 'persistence-a', `${base}/dzikir/pagi`);
    tabs.push('persistence-a');
    ready();
    clear();
    waitFor(`${count} === '0/3' && !(${isFavorite(2)}) && !(${isFavorite(3)})`);
    browser('tab', 'new', '--label', 'persistence-b', `${base}/dzikir/pagi`);
    tabs.push('persistence-b');
    ready();
    browser('tab', 'persistence-a');
    // Hold the real cross-tab lock so both documents queue changes from stale UI.
    check(`void navigator.locks.request('muslim-storage:muslim-reading', () => new Promise(resolve => {
      window.__releaseReadingLock = resolve;
    }));`);
    waitFor(`typeof window.__releaseReadingLock === 'function'`);
    browser('click', increment);
    browser('click', increment);
    clickFavorite(2);
    browser('tab', 'persistence-b');
    browser('click', increment);
    browser('click', increment);
    clickFavorite(3);
    browser('tab', 'persistence-a');
    check('window.__releaseReadingLock()');
    waitFor(`${count} === '3/3' && ${isFavorite(2)} && ${isFavorite(3)}`);
    browser('tab', 'persistence-b');
    waitFor(`${count} === '3/3' && ${isFavorite(2)} && ${isFavorite(3)}`);

    browser('tab', 'persistence-a');
    browser(
      'find',
      'role',
      'button',
      'click',
      '--name',
      'Mulai sesi baru',
      '--exact'
    );
    waitFor(`${count} === '0/3'`);
    browser('tab', 'persistence-b');
    waitFor(`${count} === '0/3'`);
    browser('click', increment);
    browser('tab', 'persistence-a');
    waitFor(
      `${count} === '1/3' && !document.body.textContent.includes('Batalkan reset sesi')`
    );

    openSettings();
    check(
      `document.getElementById('translation').scrollIntoView({ block: 'center' })`
    );
    browser('click', '#translation');
    waitFor(
      `document.getElementById('translation').getAttribute('aria-checked') === 'false'`
    );
    browser('tab', 'persistence-b');
    openSettings();
    waitFor(
      `document.getElementById('translation').getAttribute('aria-checked') === 'false'`
    );
    browser('focus', '#font-arabic [role=slider]');
    browser('press', 'ArrowRight');
    waitFor(
      `document.querySelector('#font-arabic [role=slider]').getAttribute('aria-valuenow') === '25'`
    );
    browser('tab', 'persistence-a');
    waitFor(
      `document.querySelector('#font-arabic [role=slider]').getAttribute('aria-valuenow') === '25' && document.getElementById('translation').getAttribute('aria-checked') === 'false'`
    );
    browser('press', 'Escape');
    browser('tab', 'persistence-b');
    browser('press', 'Escape');
    clear();
    browser('tab', 'persistence-a');
    waitFor(`${count} === '0/3' && !(${isFavorite(2)}) && !(${isFavorite(3)})`);
    browser('reload');
    ready();
    waitFor(`${count} === '0/3' && !(${isFavorite(2)})`);
    console.log(
      'PASS: two tabs merge favorites, bound concurrent counts, invalidate undo and synchronize settings/deletion'
    );

    check(`window.__storageErrors = [];
      window.addEventListener('error', event => window.__storageErrors.push(event.message));
      window.addEventListener('unhandledrejection', event => window.__storageErrors.push(String(event.reason)));
      window.__savedReading = localStorage.getItem('muslim-reading');
      window.__savedSettings = localStorage.getItem('muslim-settings');
      window.__warningCount = 0;
      const seenWarnings = new WeakSet();
      new MutationObserver(records => {
        for (const record of records) for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          // The first toast may arrive inside a newly inserted toaster container.
          const selector = '[data-sonner-toast][data-type="warning"]';
          for (const warning of [node, ...node.querySelectorAll(selector)]) {
            if (!warning.matches(selector) || seenWarnings.has(warning)) continue;
            seenWarnings.add(warning);
            window.__warningCount++;
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key === 'muslim-reading' || key === 'muslim-settings') throw new DOMException('Quota exceeded', 'QuotaExceededError');
        return original.call(this, key, value);
      };
      window.__restoreStorage = () => { Storage.prototype.setItem = original; };`);
    browser('click', increment);
    waitFor(
      `document.querySelector('[data-sonner-toast][data-type="warning"]')?.textContent.includes('Perubahan hanya berlaku selama sesi ini.')`
    );
    browser('click', increment);
    clickFavorite(2);
    waitFor(
      `${count} === '2/3' && ${isFavorite(2)} && document.body.textContent.includes('Progres dan favorit hanya berlaku selama sesi ini')`
    );
    check(`if (document.body.textContent.includes('Progres tersimpan di perangkat ini')) throw Error('Temporary progress claims to be saved');
      if (document.body.textContent.includes('Disimpan ke favorit.')) throw Error('Temporary favorite claims to be saved');
      window.dispatchEvent(new Event('focus')); window.dispatchEvent(new Event('pageshow'));`);
    waitFor(`${count} === '2/3' && ${isFavorite(2)}`);
    openSettings();
    browser('focus', '#font-arabic [role=slider]');
    browser('press', 'ArrowRight');
    waitFor(
      `document.querySelector('#font-arabic [role=slider]').getAttribute('aria-valuenow') === '25' && document.querySelector('[role=dialog]').textContent.includes('Pengaturan bacaan hanya berlaku selama sesi ini')`
    );
    browser('press', 'Escape');
    check(`window.__restoreStorage(); window.dispatchEvent(new Event('focus'));
      if (window.__warningCount !== 1) throw Error('Storage warning did not appear exactly once: ' + window.__warningCount);
      if (window.__storageErrors.length) throw Error('Storage rejection escaped: ' + window.__storageErrors);`);
    browser('click', increment);
    waitFor(`${count} === '3/3'`);
    check(
      `if (localStorage.getItem('muslim-reading') !== window.__savedReading || localStorage.getItem('muslim-settings') !== window.__savedSettings) throw Error('Temporary data overwrote durable data after recovery');`
    );
    browser('reload');
    ready();
    waitFor(`${count} === '0/3' && !(${isFavorite(2)})`);
    console.log(
      'PASS: denied storage retains session edits, warns once, reports temporary status and never flushes stale data'
    );
  } finally {
    for (const tab of tabs.toReversed()) browser('tab', 'close', tab);
    browser('tab', 't1');
  }
}
