import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { Amiri, Outfit } from 'next/font/google';
import { cookies } from 'next/headers';

import { env } from '@/env';
import { parseLocationCookie } from '@/lib/parse-location-cookie';
import { cn } from '@/lib/utils';
import { LocationStoreProvider } from '@/providers/location-store-provider';
import { PaletteStoreProvider } from '@/providers/palette-store-provider';
import { QueryProvider } from '@/providers/query-provider';
import { SettingsStoreProvider } from '@/providers/settings-store-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { LOCATION_COOKIE_NAME } from '@/stores/location-store';

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
    statusBarStyle: 'default',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf5ff' },
    { media: '(prefers-color-scheme: dark)', color: '#322659' },
  ],
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const locationCookie = cookieStore.get(LOCATION_COOKIE_NAME);
  const locationState = parseLocationCookie(locationCookie?.value);

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn('font-sans antialiased', outfit.variable, amiri.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <LocationStoreProvider initialState={locationState}>
              <SettingsStoreProvider>
                <PaletteStoreProvider>{children}</PaletteStoreProvider>
              </SettingsStoreProvider>
            </LocationStoreProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
