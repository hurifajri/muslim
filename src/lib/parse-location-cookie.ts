import type { LocationState } from '@/schemas/location';
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
    const state = parsed?.state;
    if (state?.city && state?.country) {
      return { city: state.city, country: state.country };
    }
  } catch {
    // Invalid cookie — fall back to defaults
  }

  return defaultLocationState;
}
