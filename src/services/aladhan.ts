import { parse } from 'valibot';

import { env } from '@/env';
import {
  AladhanResponseSchema,
  type AladhanTimingsByLocationParams,
} from '@/schemas/praying-time';

/**
 * Fetches prayer timings from the Aladhan API.
 * Supports both city-based and coordinates-based lookup.
 */
export async function fetchAladhanTimings(
  params: AladhanTimingsByLocationParams
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
    url = `${baseUrl}/timingsByCity?${searchParams}`;
  } else {
    const searchParams = new URLSearchParams({
      latitude: String(params.latitude),
      longitude: String(params.longitude),
      method: String(method),
      adjustment: String(adjustment),
    });
    url = `${baseUrl}/timings?${searchParams}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Aladhan API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return parse(AladhanResponseSchema, json);
}
