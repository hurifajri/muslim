import { useEffect, useState } from 'react';

export function observeClock(onTick: (now: Date) => void) {
  const update = () => onTick(new Date());
  const initial = window.setTimeout(update, 0);
  const interval = window.setInterval(update, 1000);
  const onVisible = () => {
    if (document.visibilityState === 'visible') update();
  };
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('pageshow', update);
  return () => {
    window.clearTimeout(initial);
    window.clearInterval(interval);
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('pageshow', update);
  };
}

export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => observeClock(setNow), []);
  return now;
}
