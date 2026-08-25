import { useState } from 'react';

import { doas } from '@/data/doas';
import type { ContentItem, ParentItem } from '@/schemas/items';

export type RandomDoa = Pick<ParentItem, 'title'> &
  Pick<ContentItem, 'arabic' | 'translation' | 'narrator'>;

function getRandomDoa(): RandomDoa {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  const random1 = array[0] / (0xffffffff + 1);
  const random2 = array[1] / (0xffffffff + 1);

  const randomParent = doas[Math.floor(random1 * doas.length)];
  const randomItem =
    randomParent.items[Math.floor(random2 * randomParent.items.length)];

  return {
    title: randomParent.title,
    arabic: randomItem.arabic,
    translation: randomItem.translation,
    narrator: randomItem.narrator,
  };
}

export function useRandomDoa() {
  const [randomDoa, setRandomDoa] = useState<RandomDoa>(getRandomDoa);

  const rollNewDoa = () => {
    setRandomDoa(getRandomDoa());
  };

  return { randomDoa, rollNewDoa };
}
