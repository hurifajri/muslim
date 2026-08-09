// Eksternal
// Internal
import { useEffect, useState } from 'react';

import { quotes } from '@/data/quotes';

interface Quote {
  id: number;
  quote: string;
  narrator: string;
}

const useQuote = (): Quote => {
  const totalQuotes = quotes?.length ?? 0;
  const [randomNumber, setRandomNumber] = useState(0);

  const delay = 1000 * 30; // Change quote every 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRandomNumber(Math.floor(Math.random() * totalQuotes));
    }, 0);
    const timer = setInterval(
      () => setRandomNumber(Math.floor(Math.random() * totalQuotes)),
      delay
    );
    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [delay, totalQuotes]);

  return quotes[randomNumber] ?? quotes[0];
};

export { useQuote };
