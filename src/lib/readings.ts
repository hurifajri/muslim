import { categories, type Collection } from '@/data/categories';
import { doas } from '@/data/doas';
import { dzikirs } from '@/data/dzikirs';
import { readingHref, readingId } from '@/lib/reading-identity';
import type { ParentItem } from '@/schemas/items';

function indexCollection(collection: Collection, parents: ParentItem[]) {
  return parents.flatMap(parent =>
    parent.items.map(child => ({
      ...child,
      id: readingId(collection, parent.id, child.id),
      title: parent.title,
      categories: parent.categories,
      categoryLabel: categories
        .filter(
          entry =>
            entry.category === collection &&
            parent.categories.includes(entry.slug)
        )
        .map(entry => entry.title)
        .join(' · '),
      href: readingHref(collection, parent.categories[0], parent.id, child.id),
    }))
  );
}

export const readings = [
  ...indexCollection('dzikir', dzikirs),
  ...indexCollection('doa', doas),
];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}|ـ|['’]/gu, '')
    .toLocaleLowerCase('id-ID')
    .trim();
}
const index = readings.map(reading => ({
  reading,
  text: normalize(
    [
      reading.title,
      reading.categoryLabel,
      reading.arabic,
      reading.translation,
      reading.transliteration,
      reading.narrator,
    ].join(' ')
  ),
}));

export function searchReadings(query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return index
    .filter(item => terms.every(term => item.text.includes(term)))
    .map(item => item.reading);
}
