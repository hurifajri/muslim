import { parse } from 'valibot';

import { env } from '@/env';
import { readPrayerCache, writePrayerCache } from '@/lib/prayer-cache';
import { isTimeZone, scheduleDate } from '@/lib/prayer-time';
import {
  AladhanResponseSchema,
  type AladhanTimingsByLocationParams,
} from '@/schemas/praying-time';

/**
 * Fetches prayer timings from the Aladhan API.
 * Supports both city-based and coordinates-based lookup.
 */
export function getAladhanUrl(
  params: AladhanTimingsByLocationParams,
  date: string
) {
  const baseUrl = env.NEXT_PUBLIC_ALADHAN_API_URL;
  const method = params.method ?? 11;
  const adjustment = params.adjustment ?? 0;

  let url: string;

  if (params.mode === 'city') {
    const searchParams = new URLSearchParams({
      city: params.city,
      country: params.country,
      method: String(method),
      adjustment: String(adjustment),
    });
    url = `${baseUrl}/timingsByCity/${date.split('-').reverse().join('-')}?${searchParams}`;
  } else {
    const searchParams = new URLSearchParams({
      latitude: String(params.latitude),
      longitude: String(params.longitude),
      method: String(method),
      adjustment: String(adjustment),
    });
    url = `${baseUrl}/timings/${date.split('-').reverse().join('-')}?${searchParams}`;
  }

  return url;
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
    const response = parse(AladhanResponseSchema, await res.json());
    if (
      response.code !== 200 ||
      !response.data ||
      !isTimeZone(response.data.meta.timezone) ||
      scheduleDate(response.data.date.gregorian) !== date
    ) {
      throw new Error('Jadwal yang diterima tidak sesuai tanggal permintaan.');
    }
    const fetchedAt = Date.now();
    await writePrayerCache(params, response, fetchedAt);
    return { response, fetchedAt, cached: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    const saved = await readPrayerCache(params, date);
    if (saved && isTimeZone(saved.response.data!.meta.timezone))
      return { ...saved, cached: true };
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
