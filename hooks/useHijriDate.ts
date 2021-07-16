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

  // Destructure praying times
  const ptKeys = Object.keys(timings);
  const ptValues = Object.values(timings);
  const prayingTimes = ptKeys.map((key, i) => ({
    id: i,
    name: key,
    time: ptValues[i],
  }));

  return {
    isError: error,
    isLoading: !data && !error,
    prayingTimes,
    hijriDate,
  };
};

export default useHijriDate;
