// Eksternal
import { useEffect, useState } from 'react';

// Internal
import { iGregDate } from '@interfaces';

const useGregDate = (): iGregDate => {
  // Create date instance
  const date = new Date();

  // Get current gregorian date string
  const gregDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  // Get current gregorian time
  const [hours, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  const [time, setTime] = useState({ hours, minutes, seconds });

  // Watch changes of time every second
  useEffect(() => {
    const timer = setInterval(() => setTime({ hours, minutes, seconds }), 1000);
    return () => clearInterval(timer);
  }, [hours, minutes, seconds]);

  // Create gregorian date string
  const addLeadingZero = (time: number) => `${time < 10 ? '0' : ''}${time}`;
  const formattedHours = addLeadingZero(time.hours);
  const formattedMinutes = addLeadingZero(time.minutes);
  const separator = seconds % 2 === 0 ? ':' : ' ';
  const gregTime = `${formattedHours}${separator}${formattedMinutes}`;

  return { gregDate, gregTime };
};

export default useGregDate;
