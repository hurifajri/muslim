import { safeParse } from 'valibot';

import { type LocationState, LocationStateSchema } from '@/schemas/location';
import { defaultLocationState } from '@/stores/location-store';

/**
 * Parse the location from a Zustand persist cookie value.
 *
 * Zustand persist wraps state as `{ state: { city, country }, version: 0 }`.
 * Returns default location if the cookie is missing or malformed.
 */
export function parseLocationCookie(raw: string | undefined): LocationState {
  if (!raw) return defaultLocationState;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const state = safeParse(LocationStateSchema, parsed?.state);
    if (state.success) return state.output;
  } catch {
    // Invalid cookie — fall back to defaults
  }

  return defaultLocationState;
}
