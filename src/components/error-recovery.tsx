'use client';

import { CircleAlertIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type ErrorRecoveryProps = Readonly<{ retry: () => void }>;

export function ErrorRecovery({ retry }: ErrorRecoveryProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Empty className="max-w-lg p-4 sm:p-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlertIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>
            <h1>Halaman belum dapat ditampilkan</h1>
          </EmptyTitle>
          <EmptyDescription>
            Terjadi kendala saat memuat halaman. Coba lagi atau kembali ke
            beranda.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={retry}>Coba lagi</Button>
            <Button asChild variant="outline">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- A full document load also recovers a broken root layout/router. */}
              <a href="/">Kembali ke beranda</a>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
