import { queryOptions, useQuery } from '@tanstack/react-query';

interface PrayingTime {
  id: number;
  name: string;
  time: string;
}

interface HijriDate {
  isError: boolean | undefined;
  isLoading: boolean | undefined;
  hijriDate: string;
  prayingTimes: PrayingTime[];
}

const hijriDateQueryOptions = (city: string) =>
  queryOptions({
    queryKey: ['hijri-date', city],
    queryFn: async () => {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=ID&method=11&adjustment=0`
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
  });

const useHijriDate = (city: string): HijriDate => {
  // Get current hijri date and praying times
  const { data, isError, isLoading } = useQuery(hijriDateQueryOptions(city));

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
    isError,
    isLoading,
    prayingTimes,
    hijriDate,
  };
};

export { useHijriDate };
