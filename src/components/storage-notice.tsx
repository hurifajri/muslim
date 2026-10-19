'use client';

import { InfoIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useStorageStatus } from '@/hooks/use-storage-status';

export function StorageNotice() {
  const readingTemporary = useStorageStatus('muslim-reading');
  const settingsTemporary = useStorageStatus('muslim-settings');
  const notified = useRef(false);

  useEffect(() => {
    if (notified.current || (!readingTemporary && !settingsTemporary)) return;
    notified.current = true;
    toast.warning('Perubahan hanya berlaku selama sesi ini.', {
      id: 'temporary-storage',
      description:
        'Penyimpanan perangkat tidak tersedia. Perubahan akan hilang saat halaman dimuat ulang atau ditutup.',
    });
  }, [readingTemporary, settingsTemporary]);

  return null;
}

type TemporaryStorageNoticeProps = Readonly<{
  children: React.ReactNode;
}>;

export function TemporaryStorageNotice({
  children,
}: TemporaryStorageNoticeProps) {
  return (
    <Alert role="note">
      <InfoIcon aria-hidden="true" />
      <AlertTitle>Penyimpanan sementara</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
