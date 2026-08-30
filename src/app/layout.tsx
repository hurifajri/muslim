import '@/styles/globals.css';

import { SerwistProvider } from '@serwist/turbopack/react';
import type { Metadata, Viewport } from 'next';
import { Amiri, Outfit } from 'next/font/google';
import { cookies } from 'next/headers';

import { InstallPrompt } from '@/components/install-prompt';
import { RouteBackground } from '@/components/route-background';
import { COLOR_PALETTES, DEFAULT_PALETTE } from '@/data/color-palettes';
import { env } from '@/env';
import { parseLocationCookie } from '@/lib/parse-location-cookie';
import { parsePaletteCookie } from '@/lib/parse-palette-cookie';
import { cn } from '@/lib/utils';
import { LocationStoreProvider } from '@/providers/location-store-provider';
import { PaletteStoreProvider } from '@/providers/palette-store-provider';
import { QueryProvider } from '@/providers/query-provider';
import { SettingsStoreProvider } from '@/providers/settings-store-provider';
import { LOCATION_COOKIE_NAME } from '@/stores/location-store';
import { PALETTE_COOKIE_NAME } from '@/stores/palette-store';

const outfit = Outfit({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const amiri = Amiri({
  variable: '--font-arabic',
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: 'Muslim • Jadwal Sholat, Dzikir, dan Doa',
    template: '%s | Muslim',
  },
  description:
    'Aplikasi web harian untuk jadwal sholat, dzikir pagi petang, dan kumpulan doa sehari-hari umat Muslim.',
  applicationName: 'Muslim',
  authors: [{ name: 'Jadi Dev' }],
  generator: 'Next.js',
  keywords: [
    'muslim',
    'jadwal sholat',
    'dzikir',
    'doa',
    'waktu sholat',
    'quran',
    'islam',
    'hijriah',
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Muslim',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Muslim App',
    title: 'Muslim • Jadwal Sholat, Dzikir, dan Doa',
    description:
      'Aplikasi web harian untuk jadwal sholat, dzikir pagi petang, dan kumpulan doa sehari-hari umat Muslim.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muslim • Jadwal Sholat, Dzikir, dan Doa',
    description:
      'Aplikasi web harian untuk jadwal sholat, dzikir pagi petang, dan kumpulan doa sehari-hari umat Muslim.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export async function generateViewport(): Promise<Viewport> {
  const cookieStore = await cookies();
  const paletteCookie = cookieStore.get(PALETTE_COOKIE_NAME);

  const parsed = parsePaletteCookie(paletteCookie?.value);
  const paletteId = parsed.paletteId || DEFAULT_PALETTE;
  const palette =
    COLOR_PALETTES.find(p => p.id === paletteId) ||
    COLOR_PALETTES.find(p => p.id === DEFAULT_PALETTE)!;

  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: palette.themeColor,
  };
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();

  const locationCookie = cookieStore.get(LOCATION_COOKIE_NAME);
  const locationState = parseLocationCookie(locationCookie?.value);

  const paletteCookie = cookieStore.get(PALETTE_COOKIE_NAME);
  const paletteState = parsePaletteCookie(paletteCookie?.value);

  const activePaletteId = paletteState.paletteId;
  const palette =
    COLOR_PALETTES.find(p => p.id === activePaletteId) ||
    COLOR_PALETTES.find(p => p.id === DEFAULT_PALETTE)!;

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          outfit.variable,
          amiri.variable,
          `palette-${activePaletteId}`,
          palette.mode === 'dark' && 'dark'
        )}
      >
        <QueryProvider>
          <LocationStoreProvider initialState={locationState}>
            <PaletteStoreProvider initialState={paletteState}>
              <SettingsStoreProvider>
                <RouteBackground />
                <SerwistProvider swUrl="/serwist/sw.js">
                  {children}
                </SerwistProvider>
                <InstallPrompt />
              </SettingsStoreProvider>
            </PaletteStoreProvider>
          </LocationStoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
