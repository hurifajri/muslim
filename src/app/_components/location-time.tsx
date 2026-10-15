'use client';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useNow } from '@/hooks/use-now';
import {
  formatLocationTime,
  getDifferentLocationTime,
} from '@/lib/location-display';
import { dateInTimeZone } from '@/lib/prayer-time';
import { hijriDateQueryOptions } from '@/queries/hijri-date';

type LocationTimeProps = Readonly<{
  city: string;
  country: string;
  timeZone?: string;
}>;

export function LocationTime({ city, country, timeZone }: LocationTimeProps) {
  const now = useNow();
  const date = now ? dateInTimeZone(now, timeZone) : '';
  const query = useQuery({
    ...hijriDateQueryOptions({ mode: 'city', city, country }, date),
    enabled: !timeZone && Boolean(date),
  });
  const resolvedZone = timeZone ?? query.data?.response.data?.meta.timezone;

  if (!resolvedZone)
    return (
      <div className="flex flex-col items-start gap-1">
        <output className="text-muted-foreground text-xs">
          {query.isError
            ? 'Waktu kota belum tersedia. Periksa koneksi lalu coba lagi.'
            : 'Memuat waktu kota…'}
        </output>
        {query.isError && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => void query.refetch()}
          >
            Coba lagi
          </Button>
        )}
      </div>
    );

  if (!now || !getDifferentLocationTime(now, resolvedZone)) return null;

  return (
    <p className="text-muted-foreground text-xs">
      Waktu setempat:{' '}
      <time dateTime={now.toISOString()} className="tabular-nums">
        {formatLocationTime(now, resolvedZone)}
      </time>{' '}
      · {resolvedZone}
    </p>
  );
}
