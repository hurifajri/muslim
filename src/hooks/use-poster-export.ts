import { toCanvas } from 'html-to-image';
import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  canvasToJpeg,
  POSTER_HEIGHT,
  POSTER_WIDTH,
  sharePosterFile,
} from '@/lib/poster-export';

export function usePosterExport(key: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    key: string;
    file: File;
    url: string;
  }>();
  const toastId = useId();
  const posterVersion = useRef<symbol | null>(null);
  useEffect(() => {
    // Invalidate pending work even when the user returns to the same options.
    posterVersion.current = Symbol();
    return () => {
      posterVersion.current = null;
      toast.dismiss(toastId);
    };
  }, [key, toastId]);
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result]
  );

  const prepare = async (node: HTMLElement) => {
    const version = posterVersion.current;
    setIsGenerating(true);
    toast.dismiss(toastId);
    try {
      await document.fonts.ready;
      await Promise.all(
        Array.from(node.querySelectorAll('img')).map(img => img.decode())
      );
      const options = {
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        canvasWidth: POSTER_WIDTH,
        canvasHeight: POSTER_HEIGHT,
        pixelRatio: 1,
        // Only the on-screen preview is scaled; capture the full-size artwork.
        style: { transform: 'none' },
      };
      // Warm the resource cache before capture (Safari may omit resources on first render).
      await toCanvas(node, options);
      const file = await canvasToJpeg(await toCanvas(node, options));
      if (version !== null && posterVersion.current === version) {
        setResult({ key, file, url: URL.createObjectURL(file) });
        toast.success('Poster siap. Pilih Unduh atau Bagikan.', {
          id: toastId,
        });
      }
    } catch {
      if (version !== null && posterVersion.current === version)
        toast.error(
          'Poster belum dapat dibuat. Periksa koneksi untuk memuat latar dan font, lalu coba lagi.',
          { id: toastId, duration: 6000 }
        );
    } finally {
      if (posterVersion.current !== null) setIsGenerating(false);
    }
  };

  const share = async (file: File, title: string) => {
    const version = posterVersion.current;
    toast.dismiss(toastId);
    const status = await sharePosterFile(file, title);
    if (version === null || posterVersion.current !== version) return;
    if (status === 'shared') {
      toast.success('Poster berhasil dibagikan.', { id: toastId });
    } else if (status !== 'cancelled') {
      toast.error(
        'Berbagi tidak tersedia. Gunakan tombol Unduh untuk menyimpan poster.',
        { id: toastId, duration: 6000 }
      );
    }
  };
  return {
    prepare,
    share,
    result: result?.key === key ? result : undefined,
    isGenerating,
  };
}
