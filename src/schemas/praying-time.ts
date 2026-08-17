import {
  array,
  boolean,
  type InferOutput,
  literal,
  nullable,
  number,
  object,
  optional,
  string,
  union,
} from 'valibot';

// ─── Greg Date ────────────────────────────────────────────────────────────────

export const GregDateResultSchema = object({
  gregDate: string(),
  gregTime: string(),
  gregSeconds: string(),
});
export type GregDateResult = InferOutput<typeof GregDateResultSchema>;

// ─── Praying Time ─────────────────────────────────────────────────────────────

export const PrayingTimeSchema = object({
  id: number(),
  name: string(),
  time: string(),
});
export type PrayingTime = InferOutput<typeof PrayingTimeSchema>;

export const HijriDateResultSchema = object({
  isError: optional(nullable(boolean())),
  isLoading: optional(nullable(boolean())),
  hijriDate: string(),
  prayingTimes: array(PrayingTimeSchema),
});
export type HijriDateResult = InferOutput<typeof HijriDateResultSchema>;

// ─── Aladhan API Params ───────────────────────────────────────────────────────

const AladhanCityParamsSchema = object({
  mode: literal('city'),
  city: string(),
  country: string(),
  method: optional(number()),
  adjustment: optional(number()),
});

const AladhanCoordinatesParamsSchema = object({
  mode: literal('coordinates'),
  latitude: number(),
  longitude: number(),
  method: optional(number()),
  adjustment: optional(number()),
});

export const AladhanTimingsByLocationParamsSchema = union([
  AladhanCityParamsSchema,
  AladhanCoordinatesParamsSchema,
]);
export type AladhanTimingsByLocationParams = InferOutput<
  typeof AladhanTimingsByLocationParamsSchema
>;

// ─── API Response ─────────────────────────────────────────────────────────────

const HijriMonthSchema = object({
  number: number(),
  en: string(),
  ar: string(),
});

const HijriDateSchema = object({
  day: string(),
  month: HijriMonthSchema,
  year: string(),
});

const GregorianDateSchema = object({
  day: string(),
  month: object({ number: number(), en: string() }),
  year: string(),
});

const DateInfoSchema = object({
  hijri: HijriDateSchema,
  gregorian: GregorianDateSchema,
});

const TimingsSchema = object({
  Fajr: string(),
  Sunrise: string(),
  Dhuhr: string(),
  Asr: string(),
  Sunset: string(),
  Maghrib: string(),
  Isha: string(),
  Imsak: string(),
  Midnight: string(),
  Firstthird: optional(string()),
  Lastthird: optional(string()),
});

const AladhanDataSchema = object({
  timings: TimingsSchema,
  date: DateInfoSchema,
  meta: object({
    latitude: number(),
    longitude: number(),
    timezone: string(),
    method: object({ id: number(), name: string() }),
    latitudeAdjustmentMethod: string(),
    midnightMode: string(),
    school: string(),
    offset: object({}),
  }),
});

export const AladhanResponseSchema = object({
  code: number(),
  status: string(),
  data: nullable(AladhanDataSchema),
});
