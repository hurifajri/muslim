import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { doas } from '@/data/doas';

type PageProps = {
  params: Promise<{ category: string }>;
};

function toTitleCase(str: string) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const title = `Doa ${toTitleCase(category)}`;

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
  const filteredDoas = doas.filter((doa) => doa.category.includes(category));

  return (
    <>
      <Header />
      <Items items={filteredDoas} />
    </>
  );
}
