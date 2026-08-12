import type { Metadata } from 'next';

import { capitalize } from '@/lib/utils';

import { DoaShell } from './_components/doa-shell';

type PageProps = {
  params: Promise<{ category: string }>;
};

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

export default function DoaPage() {
  return (
    <>
      <h1 className="sr-only">Placeholder</h1>
      <DoaShell />
    </>
  );
}
