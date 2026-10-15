import assert from 'node:assert/strict';
import { test } from 'node:test';

import { doas } from '@/data/doas';
import { dzikirs } from '@/data/dzikirs';

test('every reading has Arabic, translation and a usable transliteration', () => {
  for (const parent of [...doas, ...dzikirs]) {
    for (const child of parent.items) {
      assert.ok(child.arabic.trim(), parent.title);
      assert.ok(child.translation.trim(), parent.title);
      assert.ok(child.transliteration.trim(), `${parent.title} / ${child.id}`);
    }
  }
});
