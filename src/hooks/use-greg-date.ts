import { useEffect, useState } from 'react';

import type { GregDateResult } from '@/schemas/praying-time';

export type { GregDateResult };

/**
 * Returns the current Gregorian date and time, updating every second.
 */
export const useGregDate = (): GregDateResult => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, []);

  const date = now ?? new Date(0); // safe fallback for SSR

  const gregDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  const pad = (t: number) => String(t).padStart(2, '0');
  const gregTime = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const gregSeconds = pad(date.getSeconds());

  return { gregDate, gregTime, gregSeconds };
};
