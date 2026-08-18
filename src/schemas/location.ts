import { type InferOutput, object, string } from 'valibot';

// ─── Location State ───────────────────────────────────────────────────────────

export const LocationStateSchema = object({
  city: string(),
  country: string(),
});
export type LocationState = InferOutput<typeof LocationStateSchema>;
