import type { Locale } from 'date-fns/locale';
import { enUS } from 'date-fns/locale/en-US';
import { id } from 'date-fns/locale/id';

/**
 * Map of supported date-fns locale objects keyed by BCP 47 language tag.
 * Add entries here when you want to support additional languages.
 */
const LOCALE_MAP: Record<string, Locale> = {
  id: id,
  'id-ID': id,
  en: enUS,
  'en-US': enUS,
};

/**
 * Resolves the best matching date-fns locale for the user's browser language.
 *
 * Resolution order:
 * 1. Exact match (e.g. `id-ID`)
 * 2. Base language match (e.g. `id`)
 * 3. Fallback to Indonesian (`id`)
 */
export function getDateFnsLocale(): Locale {
  if (typeof navigator === 'undefined') return id;

  const lang = navigator.language;

  // Try exact match first (e.g. "en-US", "id-ID")
  if (LOCALE_MAP[lang]) return LOCALE_MAP[lang];

  // Try base language (e.g. "en" from "en-GB")
  const base = lang.split('-')[0];
  if (LOCALE_MAP[base]) return LOCALE_MAP[base];

  // Default to Indonesian
  return id;
}
