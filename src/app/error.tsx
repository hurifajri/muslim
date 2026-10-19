'use client';

import { ErrorRecovery } from '@/components/error-recovery';

type ErrorPageProps = Readonly<{ retry: () => void }>;

export default function ErrorPage({ retry }: ErrorPageProps) {
  return <ErrorRecovery retry={retry} />;
}
