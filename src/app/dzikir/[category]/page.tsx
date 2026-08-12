import type { Metadata } from 'next';

import { capitalize } from '@/lib/utils';

import { DzikirShell } from './_components/dzikir-shell';

type PageProps = {
  params: Promise<{ category: string }>;
};

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

export default function DzikirPage() {
  return (
    <>
      <h1 className="sr-only">Placeholder</h1>
      <DzikirShell />
    </>
  );
}
