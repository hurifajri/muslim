import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { getCategory } from '@/data/categories';
import { doas } from '@/data/doas';

type PageProps = Readonly<{
  params: Promise<{ category: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const entry = getCategory('doa', category);
  if (!entry) notFound();
  const title = entry.title;

  return {
    title,
    description: `Kumpulan ${title.toLowerCase()} sehari-hari untuk umat Muslim.`,
    alternates: {
      canonical: entry.link,
    },
  };
}

export default async function DoaPage({ params }: PageProps) {
  const { category } = await params;
  const entry = getCategory('doa', category);
  if (!entry) notFound();
  const title = entry.title;
  const filteredDoas = doas.filter(doa => doa.categories.includes(entry.slug));

  return (
    <div className="bg-background flex min-h-dvh flex-col overflow-hidden pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
      <Header title={title} />
      <Items items={filteredDoas} scope={`doa:${category}`} />
    </div>
  );
}
