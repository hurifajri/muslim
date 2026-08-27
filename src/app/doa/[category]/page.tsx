import type { Metadata } from 'next';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { doas } from '@/data/doas';
import { capitalize } from '@/lib/utils';
import type { Category } from '@/schemas/items';

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
  const filteredDoas = doas.filter(doa =>
    doa.categories.includes(category as Category)
  );

  return (
    <div className="bg-app-2 flex min-h-dvh flex-col overflow-hidden pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
      <Header title={title} />
      <Items items={filteredDoas} />
    </div>
  );
}
