import {
  array,
  type InferOutput,
  number,
  object,
  safeParse,
  string,
} from 'valibot';

import { scheduleDate } from '@/lib/prayer-time';
import { safeStorage } from '@/lib/safe-storage';
import {
  AladhanResponseSchema,
  type AladhanTimingsByLocationParams,
} from '@/schemas/praying-time';

const CACHE_KEY = 'muslim-prayer-schedules';
const EntriesSchema = array(
  object({
    location: string(),
    response: AladhanResponseSchema,
    fetchedAt: number(),
  })
);

export function prayerLocationKey(params: AladhanTimingsByLocationParams) {
  const position =
    params.mode === 'city'
      ? [params.city.toLowerCase().trim(), params.country.toUpperCase().trim()]
      : [params.latitude, params.longitude];
  return JSON.stringify([
    params.mode,
    ...position,
    params.method ?? 11,
    params.adjustment ?? 0,
  ]);
}

function readEntries() {
  try {
    const parsed = safeParse(
      EntriesSchema,
      JSON.parse(safeStorage.getItem(CACHE_KEY) ?? '[]')
    );
    return parsed.success ? parsed.output : [];
  } catch {
    return [];
  }
}

export function readPrayerCache(
  params: AladhanTimingsByLocationParams,
  date: string
) {
  const entries = readEntries().filter(
    entry => entry.location === prayerLocationKey(params) && entry.response.data
  );
  return (
    entries.find(
      entry => scheduleDate(entry.response.data!.date.gregorian) === date
    ) ??
    entries
      .filter(entry => scheduleDate(entry.response.data!.date.gregorian) < date)
      .sort((a, b) => b.fetchedAt - a.fetchedAt)[0]
  );
}

export function writePrayerCache(
  params: AladhanTimingsByLocationParams,
  response: InferOutput<typeof AladhanResponseSchema>,
  fetchedAt: number
) {
  if (!response.data) return;
  const location = prayerLocationKey(params);
  const date = scheduleDate(response.data.date.gregorian);
  const entries = readEntries().filter(
    entry =>
      !(
        entry.location === location &&
        entry.response.data &&
        scheduleDate(entry.response.data.date.gregorian) === date
      )
  );
  safeStorage.setItem(
    CACHE_KEY,
    JSON.stringify([{ location, response, fetchedAt }, ...entries].slice(0, 12))
  );
}
