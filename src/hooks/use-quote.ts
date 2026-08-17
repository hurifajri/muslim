import { useEffect, useState } from 'react';

import { quotes } from '@/data/quotes';
import type { Quote } from '@/schemas/common';

const QUOTE_INTERVAL_MS = 30_000; // 30 seconds

/**
 * Returns a randomly selected quote that changes every 30 seconds.
 * The first quote is randomized immediately on mount.
 */
export const useQuote = (): Quote => {
  const total = quotes?.length ?? 0;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const randomize = () => {
      if (total === 0) return;
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      setIndex(array[0] % total);
    };

    // Randomize immediately on mount (deferred to avoid SSR mismatch)
    const timeout = setTimeout(randomize, 0);
    const interval = setInterval(randomize, QUOTE_INTERVAL_MS);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [total]);

  return quotes[index] ?? quotes[0];
};
