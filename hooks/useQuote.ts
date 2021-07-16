// Eksternal
import { useEffect, useState } from 'react';

// Internal
import { iQuote } from '@interfaces';
import { quotes } from '@data';

const useQuote = (): iQuote => {
  const totalQuotes = quotes?.length ?? 0;
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * totalQuotes)
  );

  const delay = 1000 * 30; // Change quote every 30 seconds
  useEffect(() => {
    const timer = setInterval(
      () => setRandomNumber(Math.floor(Math.random() * totalQuotes)),
      delay
    );
    return () => clearInterval(timer);
  }, [delay, randomNumber, totalQuotes]);

  return quotes[randomNumber];
};

export default useQuote;
