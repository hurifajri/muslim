import { useEffect, useState } from 'react';

import { doas } from '@/data/doas';

export type RandomDoa = {
  title: string;
  arabic: string;
  translation: string;
  narrator: string;
};

export function useRandomDoa() {
  const [randomDoa, setRandomDoa] = useState<RandomDoa>({
    title: doas[0].title,
    arabic: doas[0].items[0].arabic,
    translation: doas[0].items[0].translation,
    narrator: doas[0].items[0].narrator,
  });

  const rollNewDoa = () => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);
    const random1 = array[0] / (0xffffffff + 1);
    const random2 = array[1] / (0xffffffff + 1);

    const randomParent = doas[Math.floor(random1 * doas.length)];
    const randomItem =
      randomParent.items[Math.floor(random2 * randomParent.items.length)];

    setRandomDoa({
      title: randomParent.title,
      arabic: randomItem.arabic,
      translation: randomItem.translation,
      narrator: randomItem.narrator,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      rollNewDoa();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return { randomDoa, rollNewDoa };
}
