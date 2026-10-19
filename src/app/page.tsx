import type { Metadata } from 'next';

import { HomeShell } from './_components/home-shell';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Muslim • Jadwal salat, dzikir, dan doa</h1>
      <HomeShell />
    </>
  );
}
