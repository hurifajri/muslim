import { useCallback, useSyncExternalStore } from 'react';

import { dateInTimeZone } from '@/lib/prayer-time';

function subscribe(update: () => void) {
  const interval = window.setInterval(update, 1000);
  window.addEventListener('pageshow', update);
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  return () => {
    window.clearInterval(interval);
    window.removeEventListener('pageshow', update);
    window.removeEventListener('focus', update);
    document.removeEventListener('visibilitychange', update);
  };
}

const serverDate = () => '';

// React only rerenders when the date changes, even though midnight is checked each second.
export function useCurrentDate(timeZone?: string) {
  return useSyncExternalStore(
    subscribe,
    useCallback(() => dateInTimeZone(new Date(), timeZone), [timeZone]),
    serverDate
  );
}
