import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { getCategory } from '@/data/categories';
import { dzikirs } from '@/data/dzikirs';

type DzikirPageProps = Readonly<{
  params: Promise<{ category: string }>;
}>;

export async function generateMetadata({
  params,
}: DzikirPageProps): Promise<Metadata> {
  const { category } = await params;
  const entry = getCategory('dzikir', category);
  if (!entry) notFound();
  const title = entry.title;

  return {
    title,
    description: `Bacaan ${title.toLowerCase()} sesuai sunnah untuk umat Muslim.`,
    alternates: {
      canonical: entry.link,
    },
  };
}

export default async function DzikirPage({ params }: DzikirPageProps) {
  const { category } = await params;
  const entry = getCategory('dzikir', category);
  if (!entry) notFound();
  const title = entry.title;
  const filteredDzikirs = dzikirs.filter(dzikir =>
    dzikir.categories.includes(entry.slug)
  );

  return (
    <div className="bg-background flex min-h-dvh flex-col overflow-hidden pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
      <Header title={title} />
      <Items items={filteredDzikirs} scope={`dzikir:${category}`} />
    </div>
  );
}
