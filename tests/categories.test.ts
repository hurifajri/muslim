import assert from 'node:assert/strict';
import { test } from 'node:test';

import { categories, getCategory } from '@/data/categories';

test('only valid collection/category pairs resolve', () => {
  assert.equal(getCategory('doa', 'pagi'), undefined);
  assert.equal(getCategory('dzikir', 'quran'), undefined);
  assert.equal(getCategory('doa', 'quran')?.title, "Doa Al-Qur'an");
  assert.equal(getCategory('doa', 'unknown'), undefined);
  assert.equal(new Set(categories.map(item => item.link)).size, 5);
});
