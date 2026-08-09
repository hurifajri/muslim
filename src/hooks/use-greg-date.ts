// Eksternal
import { useEffect, useState } from 'react';

interface GregDate {
  gregDate: string;
  gregTime: string;
}

const useGregDate = (): GregDate => {
  const [now, setNow] = useState<Date | null>(null);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
      setBlink(b => !b);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const date = now ?? new Date(0); // safe fallback for SSR

  const gregDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  const addLeadingZero = (t: number) => `${t < 10 ? '0' : ''}${t}`;
  const formattedHours = addLeadingZero(date.getHours());
  const formattedMinutes = addLeadingZero(date.getMinutes());
  const separator = now ? (blink ? ':' : ' ') : ':';
  const gregTime = `${formattedHours}${separator}${formattedMinutes}`;

  return { gregDate, gregTime };
};

export { useGregDate };
