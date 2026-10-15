import { format } from 'date-fns';
import { useMemo } from 'react';

import { useNow } from '@/hooks/use-now';
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
  const now = useNow();
  const locale = useMemo(() => getDateFnsLocale(), []);

  return {
    gregDate: now ? format(now, 'PPPP', { locale }) : '',
    gregTime: now ? format(now, 'HH:mm', { locale }) : '--:--',
    gregSeconds: now ? format(now, 'ss', { locale }) : '--',
  };
};
