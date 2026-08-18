import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { getDateFnsLocale } from '@/lib/locale';
import type { GregDateResult } from '@/schemas/praying-time';

export type { GregDateResult };

/**
 * Returns the current Gregorian date and time, updating every second.
 * Date and time format adapts to the user's browser locale.
 *
 * Initializes with `new Date()` immediately so there's no blank flash.
 * The consuming component should use `suppressHydrationWarning` on elements
 * displaying these values, since server and client times will differ.
 */
export const useGregDate = (): GregDateResult => {
  const [now, setNow] = useState(() => new Date());
  const locale = useMemo(() => getDateFnsLocale(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    gregDate: format(now, 'PPPP', { locale }),
    gregTime: format(now, 'HH:mm', { locale }),
    gregSeconds: format(now, 'ss', { locale }),
  };
};
