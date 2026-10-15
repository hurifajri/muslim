import type { Collection } from '@/data/categories';
import { readingAnchor } from '@/lib/reading-identity';
import type { ParentItem } from '@/schemas/items';

export function getSessionProgress(
  items: ParentItem[],
  scope: string,
  counts: Record<string, number>
) {
  const collection = scope.split(':')[0] as Collection;
  const entries = items.flatMap(parent =>
    parent.repetitions
      ? parent.items.map(child => ({
          id: `${scope}:${parent.id}:${child.id}`,
          anchor: readingAnchor(collection, parent.id, child.id),
          title: parent.title,
          target: parent.repetitions!,
        }))
      : []
  );
  const completed = entries.filter(
    entry => (counts[entry.id] ?? 0) >= entry.target
  ).length;
  return {
    entries,
    completed,
    total: entries.length,
    next: entries.find(entry => (counts[entry.id] ?? 0) < entry.target),
  };
}
