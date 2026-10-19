import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ReadingSession } from '@/components/reading-session';
import { dzikirs } from '@/data/dzikirs';
import { ReadingStoreProvider } from '@/providers/reading-store-provider';
import { SettingsStoreProvider } from '@/providers/settings-store-provider';

test('session navigation is disabled until persisted progress is hydrated', () => {
  const html = renderToStaticMarkup(
    createElement(
      SettingsStoreProvider,
      null,
      createElement(
        ReadingStoreProvider,
        null,
        createElement(ReadingSession, {
          items: dzikirs.filter(item => item.categories.includes('pagi')),
          scope: 'dzikir:pagi',
        })
      )
    )
  );
  assert.match(html, /<button[^>]*disabled=""[^>]*>Mulai sesi<\/button>/);
  assert.doesNotMatch(html, /href="#bacaan-/);
});
