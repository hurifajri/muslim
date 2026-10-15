import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

// Use the pinned project CLI, even when invoked directly with `node`.
const localCli = fileURLToPath(
  new URL('../node_modules/agent-browser/bin/agent-browser.js', import.meta.url)
);
const customBinary = process.env.AGENT_BROWSER_BIN;
const binary = customBinary || process.execPath;
const launcherArgs = customBinary ? [] : [localCli];
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3100';
const session = `muslim-regression-${process.pid}`;
const flags = ['--session', session, '--namespace', session];
let browserStarted = false;
if (process.env.CHROME_BIN)
  flags.push('--executable-path', process.env.CHROME_BIN);

function browser(...args) {
  const result = spawnSync(binary, [...launcherArgs, ...flags, ...args], {
    encoding: 'utf8',
    timeout: 45_000,
  });
  if (result.error?.code === 'ENOENT')
    throw new Error(
      'agent-browser tidak ditemukan. Jalankan pnpm install dan periksa path AGENT_BROWSER_BIN jika diatur.'
    );
  if (result.error || result.status !== 0)
    throw new Error(
      `${args[0]}: ${result.error?.message ?? result.stdout + result.stderr}`
    );
  return result.stdout;
}
const check = body =>
  browser('eval', `(async () => { ${body}; return true; })()`);
const waitFor = expression => {
  try {
    return browser('wait', '--fn', expression);
  } catch (error) {
    throw new Error(`Waiting for ${expression}: ${error.message}`);
  }
};
const countSelector = '#bacaan-dzikir-3-1';
const toastSelector = '[data-sonner-toast]:not([data-removed="true"])';
const checkReadingHighlight = () =>
  check(`const target = document.getElementById(location.hash.slice(1));
    if (!target) throw Error('Reading fragment has no matching element');
    const style = getComputedStyle(target);
    if (style.padding !== '16px' || !style.boxShadow.includes('0px 0px 0px 2px')) throw Error('Linked reading is missing its ring or padding');
    for (const reading of document.querySelectorAll('[id^="bacaan-"]')) {
      if (reading !== target && getComputedStyle(reading).padding !== '0px') throw Error('Previous reading kept its highlight');
    }`);
const checkPosterFont = () =>
  check(`const preview = document.querySelector('[role=dialog] fieldset [data-slot="aspect-ratio"]');
    const arabic = preview.querySelector('[lang=ar]');
    const slider = document.querySelector('[role=slider][aria-label="Ukuran teks poster"]');
    const style = getComputedStyle(arabic);
    const previewScale = arabic.getBoundingClientRect().width / parseFloat(style.width);
    const exportSize = parseFloat(style.fontSize) * previewScale * 1080 / preview.getBoundingClientRect().width;
    const value = Number(slider.getAttribute('aria-valuenow'));
    if (Math.abs(value - exportSize) > 0.1) throw Error('Poster font slider differs from exported font size: ' + value + ' vs ' + exportSize);
    if (slider.getAttribute('aria-valuetext') !== value + ' piksel') throw Error('Poster slider does not announce pixels');
    if (value > Number(slider.getAttribute('aria-valuemax'))) throw Error('Poster font exceeds its fitting limit');
    const bounds = preview.getBoundingClientRect();
    for (const text of preview.querySelectorAll('h2, p')) {
      const box = text.getBoundingClientRect();
      if (box.top < bounds.top || box.bottom > bounds.bottom || box.left < bounds.left || box.right > bounds.right) throw Error('Poster text is clipped at its maximum size');
    }`);

try {
  if (!customBinary && !existsSync(localCli))
    throw new Error(
      'agent-browser belum terpasang di proyek. Jalankan pnpm install, lalu pnpm test:browser:install.'
    );
  browser('--version');
  try {
    const response = await fetch(base, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await response.body?.cancel();
  } catch {
    throw new Error(
      `Server belum siap di ${base}. Jalankan pnpm build lalu pnpm start --hostname 127.0.0.1 --port 3100, atau atur TEST_BASE_URL ke server production yang aktif.`
    );
  }
  browserStarted = true;
  browser('open', base);
  browser('set', 'viewport', '390', '844');
  check("localStorage.setItem('installPromptDismissedAt', String(Date.now()))");
  // Finish the first install before navigating away from its initiating document.
  check('await navigator.serviceWorker.ready');
  waitFor('Boolean(navigator.serviceWorker.controller)');
  browser('reload');
  waitFor('Boolean(navigator.serviceWorker.controller)');
  browser('open', `${base}/dzikir/pagi`);
  waitFor(
    `!document.querySelector('${countSelector} button[aria-label="Tambah hitungan"]')?.disabled`
  );
  browser('click', `${countSelector} button[aria-label="Tambah hitungan"]`);
  browser('click', `${countSelector} button[aria-label="Tambah hitungan"]`);
  browser('click', '#bacaan-dzikir-2-1 button[aria-label="Simpan ke favorit"]');
  browser('reload');
  waitFor(
    `document.querySelector('${countSelector} output')?.textContent === '2/3'`
  );
  browser('set', 'offline', 'on');
  browser('reload');
  waitFor(
    `document.querySelector('${countSelector} output')?.textContent === '2/3'`
  );
  check('window.__regressionMarker = true');
  browser('set', 'offline', 'off');
  browser('wait', '500');
  check(
    "if (!window.__regressionMarker) throw Error('Reconnect reloaded the page')"
  );
  console.log(
    'PASS: counts survive reload/offline; reconnect preserves document'
  );

  browser('open', `${base}/bacaan`);
  waitFor(
    'document.getElementById("reading-search")?.getBoundingClientRect().height > 0'
  );
  check('window.__readingNavigation = true');
  browser(
    'click',
    'article a[data-slot="button"][href="/doa/quran#bacaan-doa-2-2"]'
  );
  waitFor(
    `location.hash === '#bacaan-doa-2-2' && document.querySelector('#bacaan-doa-2-2 button[aria-pressed]')?.disabled === false`
  );
  check(
    "if (!window.__readingNavigation) throw Error('Reading link reloaded the document')"
  );
  checkReadingHighlight();
  browser('back');
  waitFor(
    `location.pathname === '/bacaan' && document.getElementById('reading-search')?.getBoundingClientRect().height > 0`
  );
  browser('forward');
  waitFor(
    `location.hash === '#bacaan-doa-2-2' && document.querySelector('#bacaan-doa-2-2 button[aria-pressed]')?.disabled === false`
  );
  checkReadingHighlight();
  browser('reload');
  waitFor(
    `document.querySelector('#bacaan-doa-2-2 button[aria-pressed]')?.disabled === false`
  );
  checkReadingHighlight();

  browser('open', `${base}/dzikir/petang`);
  waitFor(
    `document.querySelector('#bacaan-dzikir-1-1 button[aria-label="Tambah hitungan"]')?.disabled === false`
  );
  browser('find', 'role', 'link', 'click', '--name', 'Mulai sesi', '--exact');
  waitFor(`location.hash === '#bacaan-dzikir-1-1'`);
  checkReadingHighlight();
  browser('click', '#bacaan-dzikir-1-1 button[aria-label="Tambah hitungan"]');
  check('window.scrollTo(0, 0)');
  waitFor('window.scrollY === 0');
  browser(
    'find',
    'role',
    'link',
    'click',
    '--name',
    'Lanjutkan sesi',
    '--exact'
  );
  waitFor(`location.hash === '#bacaan-dzikir-2-1'`);
  checkReadingHighlight();
  browser('back');
  waitFor(`location.hash === '#bacaan-dzikir-1-1'`);
  checkReadingHighlight();
  browser('forward');
  waitFor(`location.hash === '#bacaan-dzikir-2-1'`);
  checkReadingHighlight();

  browser('open', base);
  waitFor(`Boolean(document.querySelector('a[href*="#bacaan-doa-"]'))`);
  check(`window.__readingNavigation = true;
    window.__homeReadingHref = document.querySelector('a[href*="#bacaan-doa-"]').href;`);
  browser('click', 'a[href*="#bacaan-doa-"]');
  waitFor(
    `location.href === window.__homeReadingHref && document.getElementById(location.hash.slice(1))?.querySelector('button[aria-pressed]')?.disabled === false`
  );
  check(
    "if (!window.__readingNavigation) throw Error('Home reading link reloaded the document')"
  );
  checkReadingHighlight();
  console.log(
    'PASS: reading highlights follow library, home, sessions, reload and history'
  );

  browser('open', `${base}/bacaan`);
  // The search form renders after the URL-dependent Suspense boundary resolves.
  waitFor(
    'document.getElementById("reading-search")?.getBoundingClientRect().height > 0'
  );
  browser('fill', '#reading-search', 'Ayat Kursi');
  browser('find', 'role', 'button', 'click', '--name', 'Favorit', '--exact');
  waitFor('document.querySelectorAll("article").length === 1');
  check(
    "if (!document.querySelector('article a').getAttribute('href').includes('#bacaan-dzikir-2-1')) throw Error('Favorite link is incorrect')"
  );
  browser('open', `${base}/dzikir/pagi#bacaan-dzikir-2-1`);
  waitFor('Boolean(document.getElementById(location.hash.slice(1)))');
  check(
    "const target = document.getElementById(location.hash.slice(1)); if (target.getBoundingClientRect().top < 0 || target.getBoundingClientRect().top > 200) throw Error('Deep link did not scroll to its reading')"
  );
  console.log('PASS: favorites, search and direct reading link');

  // Clipboard permissions vary by browser; exercise both outcomes at that boundary.
  check(`window.__writeText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = async text => { window.__copiedReadingLink = text; };`);
  browser(
    'click',
    '#bacaan-dzikir-2-1 button[aria-label="Salin tautan bacaan"]'
  );
  waitFor(
    `document.querySelector('${toastSelector}[data-type="success"]')?.textContent.includes('Tautan disalin')`
  );
  browser(
    'click',
    '#bacaan-dzikir-2-1 button[aria-label="Salin tautan bacaan"]'
  );
  check(`if (window.__copiedReadingLink !== location.href) throw Error('Copied reading link is incorrect');
    if (document.querySelectorAll('${toastSelector}').length !== 1) throw Error('Repeated copies stacked notifications');
    if (document.querySelector('#bacaan-dzikir-2-1').textContent.includes('Tautan disalin')) throw Error('Copy success still changes the reading layout');`);
  browser('click', `${countSelector} button[aria-label="Salin tautan bacaan"]`);
  check(
    `if (document.querySelectorAll('${toastSelector}').length !== 2) throw Error('Copying different readings must keep separate toasts');`
  );
  browser('click', `${countSelector} button[aria-label="Salin tautan bacaan"]`);
  check(`if (document.querySelectorAll('${toastSelector}').length !== 2) throw Error('Copying the same reading must update its toast');
    navigator.clipboard.writeText = async () => { throw new DOMException('denied', 'NotAllowedError'); };`);
  browser(
    'click',
    '#bacaan-dzikir-2-1 button[aria-label="Salin tautan bacaan"]'
  );
  waitFor(
    `Boolean(document.querySelector('#bacaan-dzikir-2-1 input[aria-label="Tautan bacaan"]')) && document.querySelectorAll('${toastSelector}').length === 1`
  );
  check(`const reading = document.querySelector('#bacaan-dzikir-2-1');
    if (reading.querySelector('input').value !== location.href || !reading.textContent.includes('Pilih dan salin tautan berikut.')) throw Error('Clipboard rejection lost the manual copy fallback');
    navigator.clipboard.writeText = async text => { window.__copiedReadingLink = text; };`);
  console.log(
    'PASS: copy toasts are scoped to each reading and preserve manual copying'
  );
  // The exiting toast can still cover the settings button until it is removed.
  waitFor(`!document.querySelector('[data-sonner-toast]')`);

  for (const [palette, theme] of [
    ['Dahlia Hitam (Hitam)', 'dark'],
    ['Melati (Putih)', 'light'],
  ]) {
    browser(
      'find',
      'role',
      'button',
      'click',
      '--name',
      'Buka pengaturan',
      '--exact'
    );
    waitFor(`(() => {
      const dialog = document.querySelector('[role=dialog]');
      return dialog && dialog.getBoundingClientRect().right <= innerWidth + 1 &&
        dialog.getAnimations().every(animation => animation.playState === 'finished');
    })()`);
    browser('find', 'role', 'button', 'click', '--name', palette, '--exact');
    browser('press', 'Escape');
    waitFor(`!document.querySelector('[role=dialog]')`);
    browser(
      'click',
      '#bacaan-dzikir-2-1 button[aria-label="Salin tautan bacaan"]'
    );
    waitFor(
      `Boolean(document.querySelector('${toastSelector}[data-type="success"]'))`
    );
    check(`if (document.querySelector('[data-sonner-toaster]').dataset.sonnerTheme !== '${theme}') throw Error('Toast theme does not follow the palette');
      if (document.querySelector('#bacaan-dzikir-2-1 input[aria-label="Tautan bacaan"]')) throw Error('Successful retry kept the manual copy fallback');`);
    waitFor(`!document.querySelector('[data-sonner-toast]')`);
  }
  check(`navigator.clipboard.writeText = window.__writeText;`);
  console.log('PASS: toast theme follows the active palette');

  browser(
    'click',
    '#bacaan-dzikir-2-1 button[aria-label="Hapus dari favorit"]'
  );
  waitFor(
    `document.querySelector('${toastSelector}')?.textContent.includes('Dihapus dari favorit.')`
  );
  browser('click', '#bacaan-dzikir-2-1 button[aria-label="Simpan ke favorit"]');
  check(
    `if (document.querySelectorAll('${toastSelector}').length !== 1 || !document.querySelector('${toastSelector}').textContent.includes('Disimpan ke favorit.')) throw Error('Toggling the same favorite must update its toast');`
  );
  browser('click', `${countSelector} button[aria-label="Simpan ke favorit"]`);
  check(
    `if (document.querySelectorAll('${toastSelector}').length !== 2) throw Error('Different favorites must keep separate toasts');`
  );
  browser('click', `${countSelector} button[aria-label="Hapus dari favorit"]`);
  check(`const notifications = Array.from(document.querySelectorAll('${toastSelector}'));
    const removed = notifications.find(notification => notification.textContent.includes('Dihapus dari favorit.'));
    if (notifications.length !== 2 || !removed || removed.querySelector('button')) throw Error('Removing a favorite kept an obsolete toast action');
    navigator.clipboard.writeText = async () => {};`);
  browser(
    'click',
    '#bacaan-dzikir-2-1 button[aria-label="Salin tautan bacaan"]'
  );
  check(
    `if (document.querySelectorAll('${toastSelector}').length !== 3) throw Error('Copying and favoriting the same reading must use separate toasts');`
  );
  browser('hover', '[data-sonner-toaster]');
  waitFor(
    `Array.from(document.querySelectorAll('${toastSelector}')).every(toast => toast.dataset.expanded === 'true' && toast.getAnimations().every(animation => animation.playState === 'finished'))`
  );
  browser(
    'find',
    'role',
    'button',
    'click',
    '--name',
    'Lihat favorit',
    '--exact'
  );
  waitFor(
    `location.pathname === '/bacaan' && new URLSearchParams(location.search).get('tab') === 'favorit' && document.querySelectorAll('article').length === 1`
  );
  browser('reload');
  waitFor(
    `document.querySelectorAll('article').length === 1 && Array.from(document.querySelectorAll('button')).some(button => button.textContent === 'Favorit' && button.getAttribute('aria-pressed') === 'true')`
  );
  browser(
    'find',
    'role',
    'button',
    'click',
    '--name',
    'Semua bacaan',
    '--exact'
  );
  waitFor(
    `!new URLSearchParams(location.search).has('tab') && document.querySelectorAll('article').length > 1`
  );
  browser('back');
  waitFor(
    `new URLSearchParams(location.search).get('tab') === 'favorit' && document.querySelectorAll('article').length === 1`
  );
  browser('forward');
  waitFor(
    `!new URLSearchParams(location.search).has('tab') && document.querySelectorAll('article').length > 1`
  );
  console.log(
    'PASS: favorite toasts update per reading and open a persistent favorites tab'
  );

  browser('open', base);
  browser('find', 'role', 'button', 'click', '--name', 'Bagikan', '--exact');
  // Wait until the drawer stops moving so clicks use its final coordinates.
  waitFor(`(() => {
    const dialog = document.querySelector('[role=dialog]');
    return dialog?.querySelector('fieldset') &&
      dialog.getBoundingClientRect().bottom <= innerHeight + 1 &&
      dialog.getAnimations().every(animation => animation.playState === 'finished');
  })()`);
  // Pick the longest real prayer without depending on data ordering or random chance.
  const { outputFiles } = await build({
    entryPoints: [
      fileURLToPath(new URL('../src/data/doas.ts', import.meta.url)),
    ],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
  });
  const { doas } = await import(
    `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
  );
  const longest = doas
    .flatMap((parent, parentIndex) =>
      parent.items.map((item, itemIndex) => ({
        title: parent.title,
        length: [
          parent.title,
          item.arabic,
          item.translation,
          item.narrator,
        ].join('').length,
        parentRandom: Math.floor(((parentIndex + 0.5) / doas.length) * 2 ** 32),
        itemRandom: Math.floor(
          ((itemIndex + 0.5) / parent.items.length) * 2 ** 32
        ),
      }))
    )
    .sort((a, b) => b.length - a.length)[0];
  check(`const original = crypto.getRandomValues.bind(crypto);
    crypto.getRandomValues = values => {
      if (values instanceof Uint32Array && values.length === 2) {
        values[0] = ${longest.parentRandom};
        values[1] = ${longest.itemRandom};
        crypto.getRandomValues = original;
        return values;
      }
      return original(values);
    };`);
  browser('find', 'role', 'button', 'click', '--name', 'Ganti doa', '--exact');
  waitFor(
    `document.querySelector('[role=dialog] fieldset h2')?.textContent === ${JSON.stringify(longest.title)}`
  );
  waitFor(
    'Array.from(document.querySelectorAll("[role=dialog] fieldset button")).filter(button => button.textContent.trim()).every(button => button.getBoundingClientRect().bottom <= innerHeight)'
  );
  check(`const dialog = document.querySelector('[role=dialog]');
    const field = dialog.querySelector('fieldset');
    if (field.getBoundingClientRect().right > dialog.getBoundingClientRect().right + 1) throw Error('Poster controls overflow the dialog');
    const preview = field.querySelector('img').parentElement;
    if (preview.scrollHeight > preview.clientHeight + 1) throw Error('Poster text is clipped');
    const box = preview.getBoundingClientRect();
    if (Math.abs(box.width / box.height - 9 / 16) > 0.002) throw Error('Poster preview lost its 9:16 ratio');`);
  browser(
    'find',
    'role',
    'button',
    'click',
    '--name',
    'Pengaturan poster',
    '--exact'
  );
  waitFor(
    `Boolean(document.querySelector('[role=dialog][aria-label="Pengaturan poster"]'))`
  );
  check(`const controls = document.querySelector('[role=dialog][aria-label="Pengaturan poster"]');
    if (controls.querySelectorAll('[role=switch]').length !== 4 || controls.querySelectorAll('[role=slider][aria-label]').length !== 2) throw Error('Poster controls lost their labels');`);
  checkPosterFont();
  browser('focus', '[role=slider][aria-label="Ukuran teks poster"]');
  browser('press', 'End');
  checkPosterFont();
  check(`const slider = document.querySelector('[role=slider][aria-label="Ukuran teks poster"]');
    if (slider.getAttribute('aria-valuenow') !== slider.getAttribute('aria-valuemax')) throw Error('Poster slider cannot reach its fitting limit');`);
  browser('press', 'Escape');
  waitFor(
    `!document.querySelector('[role=dialog][aria-label="Pengaturan poster"]')`
  );
  browser(
    'find',
    'role',
    'button',
    'click',
    '--name',
    'Buat poster',
    '--exact'
  );
  waitFor('Boolean(document.querySelector("a[download]"))');
  waitFor(
    `document.querySelector('${toastSelector}[data-type="success"]')?.textContent.includes('Poster siap. Pilih Unduh atau Bagikan.')`
  );
  check(`const link = document.querySelector('a[download]');
    const notification = document.querySelector('${toastSelector}');
    if (notification.closest('[aria-hidden="true"]')) throw Error('Poster toast is hidden from assistive technology');
    if (document.querySelector('[role=dialog] output')) throw Error('Poster feedback still changes the dialog layout');
    const toaster = notification.closest('[data-sonner-toaster]');
    if (toaster.dataset.yPosition !== 'top' || toaster.dataset.xPosition !== 'center') throw Error('Toast may cover the mobile action row');
    const blob = await (await fetch(link.href)).blob();
    const bytes = new Uint8Array(await blob.slice(0, 3).arrayBuffer());
    if (blob.type !== 'image/jpeg' || bytes[0] !== 255 || bytes[1] !== 216) throw Error('Poster is not JPEG');
    const bitmap = await createImageBitmap(blob);
    const { width, height } = bitmap;
    bitmap.close();
    if (width !== 1080 || height !== 1920) throw Error('Poster download must be 1080 × 1920');
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(navigator, 'share', { configurable: true, value: () => Promise.reject(new Error('denied')) });`);
  browser('find', 'role', 'button', 'click', '--name', 'Bagikan', '--exact');
  waitFor(
    `document.querySelector('${toastSelector}[data-type="error"]')?.textContent.includes('Gunakan tombol Unduh')`
  );
  waitFor(`!document.querySelector('${toastSelector}')`);
  check(
    "if (!document.querySelector('a[download]')) throw Error('Share rejection lost the download')"
  );
  console.log(
    'PASS: mobile poster layout, JPEG encoding and rejected-share fallback'
  );

  browser('set', 'viewport', '1280', '720');
  // Switching from the mobile drawer mounts an animated desktop dialog.
  waitFor(`(() => {
    const dialog = document.querySelector('[role=dialog][data-slot="dialog-content"]');
    return dialog?.querySelector('[role=slider][aria-label="Ukuran teks poster"]') &&
      dialog.getAnimations().every(animation => animation.playState === 'finished');
  })()`);
  checkPosterFont();
  check(
    `window.__posterFontSize = document.querySelector('[role=slider][aria-label="Ukuran teks poster"]').getAttribute('aria-valuenow');`
  );
  browser('set', 'viewport', '1280', '577');
  checkPosterFont();
  check(`const dialog = document.querySelector('[role=dialog]');
    const panel = dialog.querySelector('fieldset').firstElementChild;
    const slider = dialog.querySelector('[role=slider][aria-label="Ukuran teks poster"]');
    if (slider.getAttribute('aria-valuenow') !== window.__posterFontSize) throw Error('Resizing preview changed the poster font size');
    if (panel.scrollHeight > panel.clientHeight + 1) throw Error('Desktop poster panel needs vertical scrolling');`);
  console.log(
    'PASS: poster font pixels stay synchronized across preview sizes'
  );

  // A delayed share result must not restore feedback for the previous prayer.
  check(`const link = document.querySelector('[role=dialog] a[download]');
    const share = Array.from(link.parentElement.querySelectorAll('button')).find(button => button.textContent.trim() === 'Bagikan');
    if (!(link.compareDocumentPosition(share) & Node.DOCUMENT_POSITION_FOLLOWING)) throw Error('Download must precede Share');
    Object.defineProperty(navigator, 'share', { configurable: true, value: () => new Promise((resolve, reject) => { window.__rejectPosterShare = reject; }) });
    const original = crypto.getRandomValues.bind(crypto);
    crypto.getRandomValues = values => {
      if (values instanceof Uint32Array && values.length === 2) {
        values.fill(0);
        crypto.getRandomValues = original;
        return values;
      }
      return original(values);
    };`);
  browser('find', 'role', 'button', 'click', '--name', 'Bagikan', '--exact');
  browser('find', 'role', 'button', 'click', '--name', 'Ganti doa', '--exact');
  waitFor(`!document.querySelector('${toastSelector}')`);
  check(`const dialog = document.querySelector('[role=dialog]');
    if (dialog.querySelector('a[download]')) throw Error('Changing prayer kept the previous export');
    window.__rejectPosterShare(new Error('denied'));
    await new Promise(resolve => setTimeout(resolve, 50));`);
  check(
    `if (document.querySelector('${toastSelector}')) throw Error('Delayed share restored feedback for an old prayer');`
  );

  // Export failures remain visible for the current poster, then clear on editing.
  check(`const img = document.querySelector('[role=dialog] fieldset img');
    window.__posterDecode = img.decode;
    img.decode = async () => { throw Error('Image decoding failed'); };`);
  browser(
    'find',
    'role',
    'button',
    'click',
    '--name',
    'Buat poster',
    '--exact'
  );
  waitFor(
    `document.querySelector('${toastSelector}[data-type="error"]')?.textContent.includes('Poster belum dapat dibuat')`
  );
  check(
    `document.querySelector('[role=dialog] fieldset img').decode = window.__posterDecode;`
  );
  browser('find', 'role', 'switch', 'click', '--name', 'Terjemahan', '--exact');
  waitFor(`!document.querySelector('${toastSelector}')`);

  check(
    `document.querySelector('[role=dialog] fieldset img').decode = () => new Promise((resolve, reject) => { window.__rejectPosterDecode = reject; });`
  );
  browser(
    'find',
    'role',
    'button',
    'click',
    '--name',
    'Buat poster',
    '--exact'
  );
  waitFor(`typeof window.__rejectPosterDecode === 'function'`);
  browser('press', 'Escape');
  waitFor(`!document.querySelector('[role=dialog]')`);
  check(`window.__rejectPosterDecode(new Error('decode failed'));
    await new Promise(resolve => setTimeout(resolve, 50));`);
  check(
    `if (document.querySelector('${toastSelector}')) throw Error('Closed poster restored an old notification');`
  );
  console.log(
    'PASS: poster toasts follow their prayer, settings and dialog lifetime'
  );
} catch (error) {
  if (browserStarted) {
    try {
      console.error(
        browser(
          'eval',
          `(async () => ({
      url: location.href,
      online: navigator.onLine,
      dialog: document.querySelector('[role=dialog]')?.innerText,
      controller: navigator.serviceWorker.controller?.scriptURL,
      workers: (await navigator.serviceWorker.getRegistrations()).map(registration => ({
        scope: registration.scope,
        active: registration.active?.state,
        installing: registration.installing?.state,
        waiting: registration.waiting?.state,
      })),
    }))()`
        )
      );
      console.error(browser('errors'));
    } catch {
      // Keep the original assertion error if the browser has already exited.
    }
  }
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (browserStarted) {
    try {
      browser('close');
    } catch (error) {
      console.error(`Browser cleanup: ${error.message}`);
    }
  }
}
