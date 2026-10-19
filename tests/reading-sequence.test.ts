import assert from 'node:assert/strict';
import { test } from 'node:test';

import { categories } from '@/data/categories';
import { doas } from '@/data/doas';
import { dzikirs } from '@/data/dzikirs';
import { getReadingSequence } from '@/lib/reading-sequence';
import { getSessionProgress } from '@/lib/reading-session';

test('every category retains all readings in display order, including prayers without targets', () => {
  for (const category of categories) {
    const data = category.category === 'dzikir' ? dzikirs : doas;
    const items = data.filter(parent =>
      parent.categories.includes(category.slug)
    );
    const scope = `${category.category}:${category.slug}`;
    const sequence = getReadingSequence(items, scope);
    assert.deepEqual(
      sequence.map(entry => entry.item),
      items.flatMap(parent => parent.items)
    );
    assert.equal(
      new Set(sequence.map(entry => entry.id)).size,
      sequence.length
    );
    for (const entry of sequence) {
      assert.equal(entry.href, `${category.link}#${entry.anchor}`);
      assert.equal(
        entry.progressId,
        `${scope}:${entry.parent.id}:${entry.item.id}`
      );
      assert.equal(entry.target, entry.parent.repetitions);
    }
    const progress = getSessionProgress(items, scope, {});
    assert.equal(
      progress.total,
      sequence.filter(entry => entry.target !== undefined).length
    );
  }
  const sequence = getReadingSequence(doas, 'doa:quran');
  assert.ok(sequence.some(entry => entry.target === undefined));
  assert.equal(sequence.length, doas.flatMap(parent => parent.items).length);
});

test('shared morning/evening readings keep identity and anchors but separate progress', () => {
  const pagi = getReadingSequence(
    dzikirs.filter(parent => parent.categories.includes('pagi')),
    'dzikir:pagi'
  );
  const petang = getReadingSequence(
    dzikirs.filter(parent => parent.categories.includes('petang')),
    'dzikir:petang'
  );
  const shared = pagi.filter(entry =>
    petang.some(other => other.id === entry.id)
  );
  assert.ok(shared.length > 0);
  for (const entry of shared) {
    const other = petang.find(other => other.id === entry.id)!;
    assert.equal(entry.anchor, other.anchor);
    assert.notEqual(entry.progressId, other.progressId);
    assert.notEqual(entry.href, other.href);
  }
});
