import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { dzikirs } from '@/data/dzikirs';
import { capitalize } from '@/lib/utils';
import type { Category } from '@/schemas/items';

type PageProps = Readonly<{
  params: Promise<{ category: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const title = `Dzikir ${capitalize(category)}`;

  return {
    title,
    description: `Bacaan ${title.toLowerCase()} sesuai sunnah untuk umat Muslim.`,
    alternates: {
      canonical: `/dzikir/${category}`,
    },
  };
}

export default async function DzikirPage({ params }: PageProps) {
  const { category } = await params;
  const title = `Dzikir ${capitalize(category)}`;
  const filteredDzikirs = dzikirs.filter(dzikir =>
    dzikir.categories.includes(category as Category)
  );

  return (
    <div className="bg-app-2 flex min-h-dvh flex-col overflow-hidden">
      <Header title={title} />
      <Items items={filteredDzikirs} />
    </div>
  );
}
