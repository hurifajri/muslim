'use client';

import { PencilIcon } from 'lucide-react';

import { MosqueIcon } from '@/components/icons/mosque';
import { Button } from '@/components/ui/button';
import { useCurrentDate } from '@/hooks/use-current-date';
import { useGregDate } from '@/hooks/use-greg-date';
import { useHijriDate } from '@/hooks/use-hijri-date';
import { useNow } from '@/hooks/use-now';
import {
  formatCityName,
  getDifferentLocationTime,
} from '@/lib/location-display';
import { formatScheduleDate } from '@/lib/prayer-time';

import { NextPrayer } from './next-prayer';

function Clock() {
  const { gregTime, gregSeconds } = useGregDate();
  return (
    <span className="flex shrink-0 flex-col items-end">
      <span className="flex items-baseline font-bold tabular-nums">
        <span className="text-4xl">{gregTime}</span>
        <span className="ml-0.5 text-xl">{gregSeconds}</span>
      </span>
      <span className="text-xs">Waktu perangkat</span>
    </span>
  );
}

function LocalClock({ timeZone }: Readonly<{ timeZone?: string }>) {
  const now = useNow();
  const time = getDifferentLocationTime(now, timeZone);
  if (!now || !time) return null;

  return (
    <span className="flex flex-col items-start">
      <time
        dateTime={now.toISOString()}
        className="flex items-baseline font-bold tabular-nums"
      >
        <span className="text-2xl">{time.slice(0, 5)}</span>
        <span className="text-sm">{time.slice(5)}</span>
      </time>
      <span className="text-xs">Waktu setempat</span>
    </span>
  );
}

export function HomeDate() {
  const date = useCurrentDate();
  const schedule = useHijriDate();
  return (
    <div className="flex flex-col">
      <span className="font-bold">
        {schedule.isCurrent ? schedule.hijriDate : 'Jadwal Sholat'}
      </span>
      <span className="text-sm font-bold">
        {date
          ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(
              new Date(`${date}T12:00:00`)
            )
          : '\u00a0'}
      </span>
    </div>
  );
}

type PrayerCardProps = Readonly<{ onOpenLocation: () => void }>;

export function PrayerCard({ onOpenLocation }: PrayerCardProps) {
  const schedule = useHijriDate();
  return (
    <section
      aria-label="Jadwal sholat"
      className="from-secondary/50 to-primary/50 shadow-glass relative flex min-h-56 flex-col justify-between gap-4 overflow-hidden rounded-4xl border border-white/50 bg-linear-to-tr p-5 backdrop-blur-xs dark:border-white/30"
    >
      <MosqueIcon
        aria-hidden
        className="pointer-events-none absolute top-0 -right-3/12 size-full scale-90 opacity-10"
      />
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <Button
            variant="ghost"
            aria-label="Buka dialog lokasi"
            onClick={onOpenLocation}
            className="-ml-4 max-w-full text-xl font-bold capitalize"
          >
            <span className="truncate">{formatCityName(schedule.city)}</span>
            <PencilIcon />
          </Button>
          <LocalClock timeZone={schedule.timeZone} />
        </div>
        <Clock />
      </div>
      <div className="relative flex flex-col gap-3">
        {schedule.prayingTimes.length > 0 ? (
          <>
            <div className="flex justify-between gap-2">
              {schedule.prayingTimes.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-sm font-bold"
                >
                  <span>{item.name}</span>
                  <span className="tabular-nums">{item.time}</span>
                </div>
              ))}
            </div>
            {schedule.isCurrent && <NextPrayer schedule={schedule} />}
            <p className="text-xs">
              Jadwal{' '}
              <time dateTime={schedule.date}>
                {formatScheduleDate(schedule.date)}
              </time>{' '}
              · {schedule.timeZone}
            </p>
            {(schedule.cached || !schedule.isCurrent) && (
              <output className="text-xs">
                {schedule.isCurrent
                  ? 'Menampilkan jadwal tersimpan.'
                  : 'Jadwal tersimpan ini bukan untuk hari ini.'}{' '}
                {schedule.fetchedAt &&
                  `Disimpan ${new Date(schedule.fetchedAt).toLocaleString('id-ID')}.`}
              </output>
            )}
          </>
        ) : (
          <output className="text-sm">
            {schedule.isError
              ? 'Jadwal belum dapat dimuat. Periksa koneksi lalu coba lagi.'
              : 'Memuat jadwal sholat…'}
          </output>
        )}
        {(schedule.isError ||
          schedule.cached ||
          (schedule.date && !schedule.isCurrent)) && (
          <Button
            variant="outline"
            size="sm"
            disabled={schedule.isFetching}
            onClick={() => void schedule.refetch()}
          >
            {schedule.isFetching ? 'Memperbarui…' : 'Coba lagi'}
          </Button>
        )}
      </div>
    </section>
  );
}
