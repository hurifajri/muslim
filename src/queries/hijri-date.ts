import { queryOptions } from '@tanstack/react-query';

import type { AladhanTimingsByLocationParams } from '@/schemas/praying-time';
import { fetchAladhanTimings } from '@/services/aladhan';

/**
 * Query options for fetching Hijri date and prayer timings.
 * Supports city-based or coordinates-based lookup.
 */
export const hijriDateQueryOptions = (
  params: AladhanTimingsByLocationParams,
  date: string
) =>
  queryOptions({
    queryKey: ['hijri-date', params, date],
    queryFn: ({ signal }) => fetchAladhanTimings(params, date, signal),
    enabled: Boolean(date),
    networkMode: 'always',
    retry: 1,
    staleTime: 60_000,
    refetchOnReconnect: 'always',
  });
