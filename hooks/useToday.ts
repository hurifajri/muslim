// Eksternal
import useSWR from 'swr';

// Internal
import { Today } from '@/interfaces';

const useToday = (): Today => {
  const date = new Date();

  // Get current gregorian date
  const greg = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  // Get current hijri date
  // by converting current gregorian date
  const [day, month, year] = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
  ];

  const BASE = 'https://api.aladhan.com';
  const { data, error } = useSWR(
    `${BASE}/v1/gToH?date=${day}-${month}-${year}&adjustment=-1`
  );

  const response = data?.data;
  const hijri = `${response?.hijri.day} ${response?.hijri.month.en} ${response?.hijri.year}`;

  return {
    isError: error,
    isLoading: !data && !error,
    today: { greg, hijri },
  };
};

export default useToday;
