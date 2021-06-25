/* eslint-disable sort-keys */

// Eksternal
import useSWR from 'swr';

// Internal
import { iHijriDate } from '@interfaces';

const useHijriDate = (city: string): iHijriDate => {
  // Get current hijri date and praying times
  const { data, error } = useSWR(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=ID&method=4&adjustment=-1`
  );

  // Set hijri date
  const date = data?.data?.date;
  const [hDay, hMonth, hYear] = [
    date?.hijri.day,
    date?.hijri.month.en,
    date?.hijri.year,
  ];
  const hijriDate = `${hDay ?? ''} ${hMonth ?? ''} ${hYear ?? ''}`;

  // Set praying times
  const pt = data?.data?.timings;
  const timings = {
    Subuh: pt?.Fajr,
    Dzuhur: pt?.Dhuhr,
    Ashar: pt?.Asr,
    Maghrib: pt?.Maghrib,
    Isya: pt?.Isha,
  };

  return {
    isError: error,
    isLoading: !data && !error,
    timings,
    hijriDate,
  };
};

export default useHijriDate;
