// Eksternal
// Internal
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import Items from '@/components/items';
import dzikirs from '@/data/dzikirs';
import capitalize from '@/helpers/capitalize';

const Dzikir = () => {
  const { query } = useRouter();
  const category = Array.isArray(query.category)
    ? query.category[0]
    : query.category ?? '';

  return (
    <>
      <NextSeo
        title={`Muslim • Dzikir ${capitalize(category)}`}
        description="Dzikir Pagi Sesuai Sunnah."
      />
      <Items items={dzikirs} category={category} />
    </>
  );
};

export default Dzikir;
