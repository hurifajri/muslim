import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Bacaan tidak ditemukan</h1>
      <p>Alamat atau kategori bacaan ini tidak tersedia.</p>
      <Button asChild>
        <Link href="/">Ke beranda</Link>
      </Button>
    </main>
  );
}
