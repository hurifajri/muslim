import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { getDateFnsLocale } from '@/lib/locale';
import type { GregDateResult } from '@/schemas/praying-time';

export type { GregDateResult };

/**
 * Returns the current Gregorian date and time, updating every second.
 * Date and time format adapts to the user's browser locale.
 */
export const useGregDate = (): GregDateResult => {
  const [now, setNow] = useState<Date | null>(null);
  const locale = useMemo(() => getDateFnsLocale(), []);

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

  const gregDate = now ? format(now, 'PPPP', { locale }) : '';

  const gregTime = now ? format(now, 'HH:mm', { locale }) : '--:--';
  const gregSeconds = now ? format(now, 'ss', { locale }) : '--';

  return { gregDate, gregTime, gregSeconds };
};
