import { MetadataRoute } from 'next';
import { cookies } from 'next/headers';

import { COLOR_PALETTES, DEFAULT_PALETTE } from '@/data/color-palettes';
import { parsePaletteCookie } from '@/lib/parse-palette-cookie';
import { PALETTE_COOKIE_NAME } from '@/stores/palette-store';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieStore = await cookies();
  const paletteCookie = cookieStore.get(PALETTE_COOKIE_NAME);

  const parsed = parsePaletteCookie(paletteCookie?.value);
  const paletteId = parsed.paletteId || DEFAULT_PALETTE;

  const palette =
    COLOR_PALETTES.find(p => p.id === paletteId) ||
    COLOR_PALETTES.find(p => p.id === DEFAULT_PALETTE)!;

  return {
    name: 'Muslim • Jadwal Sholat, Dzikir, dan Doa',
    short_name: 'Muslim',
    description: 'Jadwal sholat, dzikir, dan doa harian.',
    start_url: '/',
    display: 'standalone',
    background_color: palette.backgroundColor,
    theme_color: palette.previewColor,
    orientation: 'any',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
