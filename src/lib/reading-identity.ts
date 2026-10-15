import type { Collection } from '@/data/categories';
import { getCategory } from '@/data/categories';

export function readingId(
  collection: Collection,
  parentId: number,
  childId: number
) {
  return `${collection}:${parentId}:${childId}`;
}
export function readingAnchor(
  collection: Collection,
  parentId: number,
  childId: number
) {
  return `bacaan-${collection}-${parentId}-${childId}`;
}
export function readingHref(
  collection: Collection,
  category: string,
  parentId: number,
  childId: number
) {
  const entry = getCategory(collection, category);
  return `${entry?.link ?? '/'}#${readingAnchor(collection, parentId, childId)}`;
}
