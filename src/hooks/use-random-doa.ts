import { useCallback, useSyncExternalStore } from 'react';

import { doas } from '@/data/doas';
import { readingHref } from '@/lib/reading-identity';
import type { ContentItem, ParentItem } from '@/schemas/items';

export type RandomDoa = Pick<ParentItem, 'title'> &
  Pick<ContentItem, 'arabic' | 'translation' | 'narrator'> & { href?: string };

const SERVER_DOA: RandomDoa = {
  href: readingHref(
    'doa',
    doas[0].categories[0],
    doas[0].id,
    doas[0].items[0].id
  ),
  title: doas[0].title,
  arabic: doas[0].items[0].arabic,
  translation: doas[0].items[0].translation,
  narrator: doas[0].items[0].narrator,
};

function generateRandomDoa(): RandomDoa {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  const random1 = array[0] / (0xffffffff + 1);
  const random2 = array[1] / (0xffffffff + 1);

  const randomParent = doas[Math.floor(random1 * doas.length)];
  const randomItem =
    randomParent.items[Math.floor(random2 * randomParent.items.length)];

  return {
    href: readingHref(
      'doa',
      randomParent.categories[0],
      randomParent.id,
      randomItem.id
    ),
    title: randomParent.title,
    arabic: randomItem.arabic,
    translation: randomItem.translation,
    narrator: randomItem.narrator,
  };
}

// Module-level store for useSyncExternalStore
let currentDoa: RandomDoa = generateRandomDoa();
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return currentDoa;
}

function getServerSnapshot() {
  return SERVER_DOA;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function useRandomDoa() {
  const randomDoa = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const rollNewDoa = useCallback(() => {
    currentDoa = generateRandomDoa();
    emitChange();
  }, []);

  return { randomDoa, rollNewDoa };
}
