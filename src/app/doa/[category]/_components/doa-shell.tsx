'use client';

import { useParams } from 'next/navigation';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { doas } from '@/data/doas';

export function DoaShell() {
  const params = useParams();
  const category = params.category as string;
  const filteredDoas = doas.filter(doa => doa.category.includes(category));

  return (
    <div className="bg-app-2">
      <Header />
      <Items items={filteredDoas} />
    </div>
  );
}
