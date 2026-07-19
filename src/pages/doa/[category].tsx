// Eksternal
// Internal
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Items from '@/components/Items';
import doas from '@/data/doas';
import capitalize from '@/helpers/capitalize';

const Doa = () => {
  const { query } = useRouter();
  const category = Array.isArray(query.category)
    ? query.category[0]
    : query.category ?? '';

  return (
    <>
      <NextSeo
        title={`Muslim • Kumpulan Doa ${capitalize(category)}`}
        description="Kumpulan Doa di Dalam Al-Quran dan Hadits Nabi."
      />
      <Items items={doas} category={category} />
    </>
  );
};

export default Doa;
