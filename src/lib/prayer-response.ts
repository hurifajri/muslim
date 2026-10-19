import { parse } from 'valibot';

import { isTimeZone, scheduleDate } from '@/lib/prayer-time';
import { AladhanResponseSchema } from '@/schemas/praying-time';

export function parsePrayerResponse(value: unknown, date: string) {
  const response = parse(AladhanResponseSchema, value);
  if (
    response.code !== 200 ||
    !response.data ||
    !isTimeZone(response.data.meta.timezone) ||
    scheduleDate(response.data.date.gregorian) !== date
  ) {
    throw new Error('Jadwal yang diterima tidak sesuai tanggal permintaan.');
  }
  return response;
}
