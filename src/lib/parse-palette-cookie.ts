import { COLOR_PALETTE_IDS, type ColorPaletteId } from '@/data/color-palettes';
import type { PaletteState } from '@/stores/palette-store';
import { defaultPaletteState } from '@/stores/palette-store';

/**
 * Parse the palette from a Zustand persist cookie value.
 *
 * Zustand persist wraps state as `{ state: { paletteId }, version: 0 }`.
 * Returns default palette if the cookie is missing or malformed.
 */
export function parsePaletteCookie(raw: string | undefined): PaletteState {
  if (!raw) return defaultPaletteState;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const state = parsed?.state;
    if (state?.paletteId) {
      return { paletteId: state.paletteId };
    }
  } catch {
    // Legacy cookie might not be JSON (we previously just saved string `paletteId`)
    // or it's invalid.
    if (raw && !raw.startsWith('{')) {
      const isValidPalette = (COLOR_PALETTE_IDS as readonly string[]).includes(
        raw
      );
      if (isValidPalette) {
        return { paletteId: raw as ColorPaletteId };
      }
    }
  }

  return defaultPaletteState;
}
