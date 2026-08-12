import type { Metadata } from 'next';

import { DzikirShell } from './_components/dzikir-shell';

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
  const title = `Dzikir ${toTitleCase(category)}`;

  return {
    title,
    description: `Bacaan ${title.toLowerCase()} sesuai sunnah untuk umat Muslim.`,
    alternates: {
      canonical: `/dzikir/${category}`,
    },
  };
}

export default function DzikirPage() {
  return <DzikirShell />;
}
