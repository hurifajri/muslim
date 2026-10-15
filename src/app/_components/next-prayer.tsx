'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import type { useHijriDate } from '@/hooks/use-hijri-date';
import { useNow } from '@/hooks/use-now';
import {
  displayedPrayers,
  nextDate,
  prayerEvents,
  scheduleDate,
} from '@/lib/prayer-time';
import { useLocationStore } from '@/providers/location-store-provider';
import { hijriDateQueryOptions } from '@/queries/hijri-date';

type NextPrayerProps = Readonly<{
  schedule: ReturnType<typeof useHijriDate>;
}>;

export function NextPrayer({ schedule }: NextPrayerProps) {
  const country = useLocationStore(state => state.country);
  const date = schedule.currentDate ? nextDate(schedule.currentDate) : '';
  const tomorrow = useQuery({
    ...hijriDateQueryOptions(
      { mode: 'city', city: schedule.city, country },
      date
    ),
    enabled: schedule.isCurrent && Boolean(date),
  });
  const nextData = tomorrow.data?.response.data;
  const now = useNow();
  const events = useMemo(() => {
    if (!schedule.isCurrent || !schedule.timeZone) return [];
    const schedules = [
      {
        date: schedule.date,
        timeZone: schedule.timeZone,
        prayingTimes: schedule.prayingTimes,
      },
    ];
    if (nextData && scheduleDate(nextData.date.gregorian) === date)
      schedules.push({
        date,
        timeZone: nextData.meta.timezone,
        prayingTimes: displayedPrayers(nextData.timings),
      });
    return prayerEvents(schedules);
  }, [
    date,
    nextData,
    schedule.date,
    schedule.isCurrent,
    schedule.prayingTimes,
    schedule.timeZone,
  ]);
  const next = now
    ? events.find(event => event.at >= now.getTime())
    : undefined;
  if (!now)
    return <p className="text-sm">Menyiapkan waktu sholat berikutnya…</p>;
  if (!next)
    return (
      <div className="text-sm">
        <p>
          {tomorrow.isFetching
            ? 'Memuat jadwal sholat berikutnya…'
            : 'Jadwal sholat berikutnya belum tersedia.'}
        </p>
        {!tomorrow.isFetching && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void tomorrow.refetch()}
          >
            Coba lagi
          </Button>
        )}
      </div>
    );
  const remaining = Math.max(0, Math.ceil((next.at - now.getTime()) / 1000));
  const duration = [
    Math.floor(remaining / 3600),
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ]
    .map(value => String(value).padStart(2, '0'))
    .join(':');
  return (
    <p className="text-sm">
      <span className="font-semibold">
        {next.name}
        {next.date !== schedule.date ? ' besok' : ''}
      </span>{' '}
      dalam <span className="font-bold tabular-nums">{duration}</span>
    </p>
  );
}
