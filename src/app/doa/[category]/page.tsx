import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { doas } from '@/data/doas';
import { capitalize } from '@/lib/utils';

type PageProps = Readonly<{
  params: Promise<{ category: string }>;
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const title = `Doa ${capitalize(category)}`;

  return {
    title,
    description: `Kumpulan ${title.toLowerCase()} sehari-hari untuk umat Muslim.`,
    alternates: {
      canonical: `/doa/${category}`,
    },
  };
}

export default async function DoaPage({ params }: PageProps) {
  const { category } = await params;
  const title = `Doa ${capitalize(category)}`;
  const filteredDoas = doas.filter(doa => doa.category.includes(category));

  return (
    <div className="bg-app-2">
      <h1 className="sr-only">{title}</h1>
      <Header />
      <Items items={filteredDoas} />
    </div>
  );
}
