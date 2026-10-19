import type { Collection } from '@/data/categories';
import {
  readingAnchor,
  readingHref,
  readingId,
  readingProgressId,
} from '@/lib/reading-identity';
import type { ParentItem } from '@/schemas/items';

/** All displayed readings, regardless of whether they have a repetition target. */
export function getReadingSequence(items: ParentItem[], scope: string) {
  const [collection, category] = scope.split(':') as [Collection, string];
  return items.flatMap(parent =>
    parent.items.map(item => ({
      id: readingId(collection, parent.id, item.id),
      progressId: readingProgressId(scope, parent.id, item.id),
      anchor: readingAnchor(collection, parent.id, item.id),
      href: readingHref(collection, category, parent.id, item.id),
      title: parent.title,
      target: parent.repetitions,
      parent,
      item,
    }))
  );
}

export type ReadingEntry = ReturnType<typeof getReadingSequence>[number];
