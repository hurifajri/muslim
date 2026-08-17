import { useQuery } from '@tanstack/react-query';
import { safeParse } from 'valibot';

import { hijriDateQueryOptions } from '@/queries/hijri-date';
import {
  type AladhanTimingsByLocationParams,
  type HijriDateResult,
  HijriDateResultSchema,
  type PrayingTime,
} from '@/schemas/praying-time';

export type { AladhanTimingsByLocationParams, HijriDateResult, PrayingTime };

/**
 * Maps localized names for prayer times from English API names.
 */
const PRAYING_TIME_LABELS: Record<string, string> = {
  Fajr: 'Subuh',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
};

const DISPLAYED_PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

/**
 * Hook to fetch the current Hijri date and prayer times.
 * Accepts either city+country or GPS coordinates.
 */
export const useHijriDate = (
  params: AladhanTimingsByLocationParams
): HijriDateResult => {
  const { data, isError, isLoading } = useQuery(hijriDateQueryOptions(params));

  // Parse Hijri date
  const date = data?.data?.date;
  const hijriDate = date
    ? `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`
    : '';

  // Build ordered prayer times list
  const timings = data?.data?.timings;
  const prayingTimes: PrayingTime[] = timings
    ? DISPLAYED_PRAYERS.map((key, i) => ({
        id: i,
        name: PRAYING_TIME_LABELS[key] ?? key,
        time: timings[key],
      }))
    : [];

  const result: HijriDateResult = {
    isError,
    isLoading,
    hijriDate,
    prayingTimes,
  };

  // Runtime validation (dev-only guard)
  if (process.env.NODE_ENV === 'development') {
    const parsed = safeParse(HijriDateResultSchema, result);
    if (!parsed.success) {
      console.warn('[useHijriDate] Schema validation failed:', parsed.issues);
    }
  }

  return result;
};
