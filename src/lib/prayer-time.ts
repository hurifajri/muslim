export function dateInTimeZone(now: Date, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find(value => value.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function scheduleDate(date: {
  day: string;
  month: { number: number };
  year: string;
}): string {
  return `${date.year}-${String(date.month.number).padStart(2, '0')}-${date.day.padStart(2, '0')}`;
}

export function formatScheduleDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
import type { PrayingTime } from '@/schemas/praying-time';

export const PRAYERS = [
  ['Fajr', 'Subuh'],
  ['Dhuhr', 'Dzuhur'],
  ['Asr', 'Ashar'],
  ['Maghrib', 'Maghrib'],
  ['Isha', 'Isya'],
] as const;

export function displayedPrayers(
  timings: Record<(typeof PRAYERS)[number][0], string>
): PrayingTime[] {
  return PRAYERS.map(([key, name], id) => ({
    id,
    name,
    time: timings[key].slice(0, 5),
  }));
}

export function nextDate(date: string): string {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

export function prayerInstant(
  date: string,
  time: string,
  timeZone: string
): number | undefined {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match || +match[1] > 23 || +match[2] > 59 || !isTimeZone(timeZone))
    return;
  const wall = new Date(`${date}T${time}:00Z`).getTime();
  if (!Number.isFinite(wall)) return;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  let candidate = wall;
  for (let step = 0; step < 3; step++) {
    const parts = formatter.formatToParts(candidate);
    const part = (type: string) =>
      parts.find(value => value.type === type)!.value;
    const local = `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}`;
    if (local === `${date}T${time}:00`) return candidate;
    candidate += wall - new Date(`${local}Z`).getTime();
  }
  // A non-existent wall time during a DST transition cannot form a countdown.
}

export type DatedPrayers = {
  date: string;
  timeZone: string;
  prayingTimes: PrayingTime[];
};

export function prayerEvents(schedules: DatedPrayers[]) {
  return schedules
    .flatMap(schedule =>
      schedule.prayingTimes.flatMap(prayer => {
        const at = prayerInstant(schedule.date, prayer.time, schedule.timeZone);
        return at === undefined ? [] : [{ ...prayer, date: schedule.date, at }];
      })
    )
    .sort((a, b) => a.at - b.at);
}

export function getNextPrayer(now: Date, schedules: DatedPrayers[]) {
  const current = schedules.filter(schedule => {
    const today = dateInTimeZone(now, schedule.timeZone);
    return schedule.date === today || schedule.date === nextDate(today);
  });
  return prayerEvents(current).find(prayer => prayer.at >= now.getTime());
}
