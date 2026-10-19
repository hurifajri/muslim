// @ts-check
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from 'esbuild';

// Mount the actual fallback components around a throwing root, without shipping
// a crash endpoint or relying on undocumented Next/React internals.
/** @param {Omit<import('./browser-test-types').BrowserTestContext, 'base'>} context */
export async function testErrorRecovery({ browser, check, waitFor }) {
  /** @type {string[]} */
  const styles = JSON.parse(
    browser(
      'eval',
      `Array.from(document.querySelectorAll('link[rel="stylesheet"]'), link => link.href)`
    )
  );
  const directory = await mkdtemp(join(tmpdir(), 'muslim-error-browser-'));
  try {
    await build({
      entryPoints: [
        fileURLToPath(
          new URL('../tests/browser-error-fixture.tsx', import.meta.url)
        ),
      ],
      outfile: join(directory, 'fixture.js'),
      bundle: true,
      minify: true,
      format: 'iife',
      platform: 'browser',
      loader: { '.css': 'empty' },
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    const html = join(directory, 'index.html');
    const stylesheets = styles
      .map(href => `<link rel="stylesheet" href="${href}">`)
      .join('');
    await writeFile(
      html,
      `<!doctype html><html lang="id"><head>${stylesheets}</head><body><script src="fixture.js"></script></body></html>`
    );
    for (const mode of ['route', 'global']) {
      browser('open', `${pathToFileURL(html).href}?${mode}`);
      browser('set', 'viewport', '320', '740');
      waitFor(
        `document.querySelector('h1')?.textContent === 'Halaman belum dapat ditampilkan'`
      );
      check(`if (document.documentElement.lang !== 'id') throw Error('Missing document language');
        if (document.body.textContent.includes('Private fixture failure')) throw Error('Raw failure leaked into the UI');
        if (document.querySelector('a')?.getAttribute('href') !== '/') throw Error('Missing home recovery');
        if (document.documentElement.scrollWidth > innerWidth) throw Error('Error controls overflow mobile viewport');`);
      if (mode === 'global')
        check(
          `if (document.title !== 'Halaman bermasalah | Muslim') throw Error('Global error has no title');`
        );
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
        `document.querySelector('main')?.textContent === 'Halaman pulih.'`
      );
    }
    console.log(
      'PASS: route/global error components handle a failed root and retry without app providers'
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
