import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { getDateFnsLocale } from '@/lib/locale';
import type { GregDateResult } from '@/schemas/praying-time';

export type { GregDateResult };

/**
 * Returns the current Gregorian date and time, updating every second.
 * Uses the device's local time and the user's browser locale.
 *
 * Stable placeholders keep server-rendered or cached times out of the UI
 * until the browser clock is available after hydration.
 */
export const useGregDate = (): GregDateResult => {
  const [now, setNow] = useState<Date | null>(null);
  const locale = useMemo(() => getDateFnsLocale(), []);

  useEffect(() => {
    const update = () => setNow(new Date());
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };

    const timeout = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pageshow', update);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pageshow', update);
    };
  }, []);

  return {
    gregDate: now ? format(now, 'PPPP', { locale }) : '',
    gregTime: now ? format(now, 'HH:mm', { locale }) : '--:--',
    gregSeconds: now ? format(now, 'ss', { locale }) : '--',
  };
};
