import { readPrayerCache, writePrayerCache } from '@/lib/prayer-cache';
import { parsePrayerResponse } from '@/lib/prayer-response';
import { isTimeZone } from '@/lib/prayer-time';
import type { AladhanTimingsByLocationParams } from '@/schemas/praying-time';

/**
 * Requests prayer timings through the same-origin Aladhan proxy.
 * Supports both city-based and coordinates-based lookup.
 */
export function getAladhanUrl(
  params: AladhanTimingsByLocationParams,
  date: string
) {
  const searchParams = new URLSearchParams({
    mode: params.mode,
    date,
    method: String(params.method ?? 11),
    adjustment: String(params.adjustment ?? 0),
  });
  if (params.mode === 'city') {
    searchParams.set('city', params.city);
    searchParams.set('country', params.country);
  } else {
    searchParams.set('latitude', String(params.latitude));
    searchParams.set('longitude', String(params.longitude));
  }
  return `/api/prayer-times?${searchParams}`;
}

export async function fetchAladhanTimings(
  params: AladhanTimingsByLocationParams,
  date: string,
  signal?: AbortSignal
) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 8000);
  try {
    if (typeof navigator !== 'undefined' && navigator.onLine === false)
      throw new Error('Offline');
    const res = await fetch(getAladhanUrl(params, date), {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);
    const response = parsePrayerResponse(await res.json(), date);
    const upstreamFetchedAt = Number(res.headers.get('X-Prayer-Fetched-At'));
    const fetchedAt =
      Number.isSafeInteger(upstreamFetchedAt) && upstreamFetchedAt > 0
        ? upstreamFetchedAt
        : Date.now();
    writePrayerCache(params, response, fetchedAt);
    return { response, fetchedAt, cached: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    const saved = readPrayerCache(params, date);
    if (saved && isTimeZone(saved.response.data!.meta.timezone))
      return { ...saved, cached: true };
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
