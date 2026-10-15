import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Header } from '@/components/header';

import { ReadingLibrary } from './reading-library';

export const metadata: Metadata = {
  title: 'Cari Bacaan dan Favorit',
  alternates: { canonical: '/bacaan' },
};

export default function ReadingsPage() {
  return (
    <main className="bg-background min-h-dvh p-4">
      <Header title="Cari Bacaan" />
      <Suspense
        fallback={
          <output className="mt-28 block text-sm">Memuat bacaan…</output>
        }
      >
        <ReadingLibrary />
      </Suspense>
    </main>
  );
}
