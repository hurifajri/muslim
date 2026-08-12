'use client';

import { useParams } from 'next/navigation';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { dzikirs } from '@/data/dzikirs';

export function DzikirShell() {
  const params = useParams();
  const category = params.category as string;

  const filteredDzikirs = dzikirs.filter(dzikir =>
    dzikir.category.includes(category)
  );

  return (
    <div className="bg-app-2">
      <Header />
      <Items items={filteredDzikirs} />
    </div>
  );
}
