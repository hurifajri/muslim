import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';

import { hijriDateQueryOptions } from '@/queries/hijri-date';
import { defaultInitState } from '@/stores/settings-store';

import { HomeShell } from './_components/home-shell';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    hijriDateQueryOptions({
      mode: 'city',
      city: defaultInitState.city,
      country: defaultInitState.country,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h1 className="sr-only">Muslim • Jadwal Sholat, Dzikir, dan Doa</h1>
      <HomeShell />
    </HydrationBoundary>
  );
}
