import { queryOptions } from '@tanstack/react-query';

import type { AladhanTimingsByLocationParams } from '@/schemas/praying-time';
import { fetchAladhanTimings } from '@/services/aladhan';

/**
 * Query options for fetching Hijri date and prayer timings.
 * Supports city-based or coordinates-based lookup.
 */
export const hijriDateQueryOptions = (params: AladhanTimingsByLocationParams) =>
  queryOptions({
    queryKey: ['hijri-date', params],
    queryFn: () => fetchAladhanTimings(params),
  });
