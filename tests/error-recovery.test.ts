import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import PageError from '@/app/error';
import GlobalError from '@/app/global-error';

test('route and global error recovery render without app providers or exposing error details', () => {
  for (const component of [PageError, GlobalError]) {
    const html = renderToStaticMarkup(
      createElement(component, { retry: () => {} })
    );
    assert.match(html, /<h1[^>]*>Halaman belum dapat ditampilkan<\/h1>/);
    assert.match(html, /<button[^>]*>Coba lagi<\/button>/);
    assert.match(html, /<a[^>]*href="\/"[^>]*>Kembali ke beranda<\/a>/);
  }
  const global = renderToStaticMarkup(
    createElement(GlobalError, { retry: () => {} })
  );
  assert.match(global, /<html[^>]*lang="id"/);
  assert.match(global, /<body/);
  assert.match(global, /<title>Halaman bermasalah \| Muslim<\/title>/);
});
