import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { parseLocationCookie } from '@/lib/parse-location-cookie';
import { hijriDateQueryOptions } from '@/queries/hijri-date';
import { LOCATION_COOKIE_NAME } from '@/stores/location-store';

import { HomeShell } from './_components/home-shell';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const locationCookie = cookieStore.get(LOCATION_COOKIE_NAME);
  const { city, country } = parseLocationCookie(locationCookie?.value);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    hijriDateQueryOptions({
      mode: 'city',
      city,
      country,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">Muslim • Jadwal Sholat, Dzikir, dan Doa</h1>
      <HomeShell />
    </HydrationBoundary>
  );
}
