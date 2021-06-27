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

  const minutes = 1000 * 60;
  const hours = minutes * 60;
  const delay = hours; // Change quote every hour
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
