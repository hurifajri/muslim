import type { InferOutput } from 'valibot';

import type { AladhanResponseSchema } from '@/schemas/praying-time';

export function prayerResponse(
  day = '13'
): InferOutput<typeof AladhanResponseSchema> {
  return {
    code: 200,
    status: 'OK',
    data: {
      timings: {
        Fajr: '04:30',
        Sunrise: '05:45',
        Dhuhr: '11:45',
        Asr: '15:00',
        Sunset: '17:45',
        Maghrib: '17:45',
        Isha: '19:00',
        Imsak: '04:20',
        Midnight: '23:45',
      },
      date: {
        hijri: {
          day: '1',
          month: { number: 5, en: 'Jumada I', ar: '' },
          year: '1448',
        },
        gregorian: { day, month: { number: 10, en: 'October' }, year: '2026' },
      },
      meta: {
        latitude: -6.6,
        longitude: 106.8,
        timezone: 'Asia/Jakarta',
        method: { id: 11, name: 'Singapore' },
        latitudeAdjustmentMethod: 'ANGLE_BASED',
        midnightMode: 'STANDARD',
        school: 'STANDARD',
        offset: {},
      },
    },
  };
}

export function memoryStorage() {
  const entries = new Map<string, string>();
  return {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
    removeItem: (key: string) => {
      entries.delete(key);
    },
  };
}
