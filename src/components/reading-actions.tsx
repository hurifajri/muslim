'use client';

import { HeartIcon, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { safeStorage } from '@/lib/safe-storage';
import { useReadingStore } from '@/providers/reading-store-provider';

type ReadingActionsProps = Readonly<{ id: string; href: string }>;

export function ReadingActions({ id, href }: ReadingActionsProps) {
  const router = useRouter();
  const favorite = useReadingStore(state => state.favorites[id] ?? false);
  const hydrated = useReadingStore(state => state.hydrated);
  const toggleFavorite = useReadingStore(state => state.toggleFavorite);
  const [manualLink, setManualLink] = useState('');
  const copyToastId = `reading-link-copy:${id}`;
  const changeFavorite = async () => {
    const saved = await toggleFavorite(id);
    const temporary = safeStorage.isTemporary('muslim-reading');
    const notify = temporary ? toast.message : toast.success;
    const savedMessage = temporary
      ? 'Ditambahkan ke favorit sesi ini.'
      : 'Disimpan ke favorit.';
    const message = saved ? savedMessage : 'Dihapus dari favorit.';
    notify(message, {
      id: `reading-favorite:${id}`,
      action: saved
        ? {
            label: 'Lihat favorit',
            onClick: () => router.push('/bacaan?tab=favorit'),
          }
        : null,
    });
  };
  const copyLink = async () => {
    const url = new URL(href, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setManualLink('');
      toast.success('Tautan disalin.', { id: copyToastId });
    } catch {
      toast.dismiss(copyToastId);
      setManualLink(url);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label={favorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          aria-pressed={favorite}
          disabled={!hydrated}
          onClick={() => void changeFavorite()}
        >
          <HeartIcon fill={favorite ? 'currentColor' : 'none'} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Salin tautan bacaan"
          onClick={() => void copyLink()}
        >
          <LinkIcon />
        </Button>
      </div>
      {manualLink && (
        <>
          <output className="text-right text-xs">
            Pilih dan salin tautan berikut.
          </output>
          <Input
            aria-label="Tautan bacaan"
            readOnly
            value={manualLink}
            onFocus={event => event.target.select()}
          />
        </>
      )}
    </div>
  );
}
