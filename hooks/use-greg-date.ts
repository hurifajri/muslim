// Eksternal
import { useEffect, useState } from 'react';

// Internal
import { iGregDate } from '@interfaces';

const useGregDate = (): iGregDate => {
  // Create date instance
  const date = new Date();

  // Get current gregorian date
  const gregDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  // Get current gregorian time
  const time = date.toLocaleTimeString('id-ID');
  const [gregTime, setGregTime] = useState(time);

  useEffect(() => {
    const timer = setInterval(() => setGregTime(time), 1000);
    return () => clearInterval(timer);
  }, [time]);

  return { gregDate, gregTime };
};

export default useGregDate;
