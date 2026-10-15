import {
  check,
  type InferOutput,
  minLength,
  object,
  optional,
  pipe,
  string,
} from 'valibot';

import { isTimeZone } from '@/lib/prayer-time';

// ─── Location State ───────────────────────────────────────────────────────────

export const LocationStateSchema = object({
  city: pipe(string(), minLength(1)),
  country: pipe(string(), minLength(1)),
  timeZone: optional(pipe(string(), check(isTimeZone))),
});
export type LocationState = InferOutput<typeof LocationStateSchema>;
