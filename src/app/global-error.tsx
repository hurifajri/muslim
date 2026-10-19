'use client';

import '@/styles/globals.css';

import { ErrorRecovery } from '@/components/error-recovery';

type GlobalErrorPageProps = Readonly<{ retry: () => void }>;

export default function GlobalErrorPage({ retry }: GlobalErrorPageProps) {
  return (
    <html lang="id">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <title>Halaman bermasalah | Muslim</title>
        <ErrorRecovery retry={retry} />
      </body>
    </html>
  );
}
