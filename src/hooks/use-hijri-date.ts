import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useCurrentDate } from '@/hooks/use-current-date';
import {
  dateInTimeZone,
  displayedPrayers,
  scheduleDate,
} from '@/lib/prayer-time';
import { useLocationStore } from '@/providers/location-store-provider';
import { hijriDateQueryOptions } from '@/queries/hijri-date';

export function useHijriDate() {
  const { city, country, timeZone, setTimeZone } = useLocationStore(
    state => state
  );
  const requestedDate = useCurrentDate(timeZone);
  const query = useQuery(
    hijriDateQueryOptions({ mode: 'city', city, country }, requestedDate)
  );
  const data = query.data?.response.data;
  const resolvedZone = data?.meta.timezone;
  useEffect(() => {
    if (resolvedZone && resolvedZone !== timeZone)
      setTimeZone(city, country, resolvedZone);
  }, [city, country, resolvedZone, setTimeZone, timeZone]);
  const date = data ? scheduleDate(data.date.gregorian) : '';
  const currentDate =
    requestedDate && resolvedZone
      ? dateInTimeZone(new Date(), resolvedZone)
      : requestedDate;
  return {
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
    city,
    date,
    currentDate,
    timeZone: resolvedZone ?? timeZone,
    cached: query.data?.cached ?? false,
    fetchedAt: query.data?.fetchedAt,
    isCurrent: Boolean(date && date === currentDate),
    hijriDate: data
      ? `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`
      : '',
    prayingTimes: data ? displayedPrayers(data.timings) : [],
  };
}
