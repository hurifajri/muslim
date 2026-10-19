import { getReadingSequence } from '@/lib/reading-sequence';
import type { ParentItem } from '@/schemas/items';

export function getSessionProgress(
  items: ParentItem[],
  scope: string,
  counts: Record<string, number>
) {
  const entries = getReadingSequence(items, scope).flatMap(entry =>
    entry.target === undefined
      ? []
      : [
          {
            id: entry.progressId,
            anchor: entry.anchor,
            title: entry.title,
            target: entry.target,
          },
        ]
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
