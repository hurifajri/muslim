import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { dzikirs } from '@/data/dzikirs';
import { capitalize } from '@/lib/utils';

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
    dzikir.category.includes(category)
  );

  return (
    <div className="bg-app-2">
      <h1 className="sr-only">{title}</h1>
      <Header title={title} />
      <Items items={filteredDzikirs} />
    </div>
  );
}
