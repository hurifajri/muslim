// Eksternal
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// Internal
import { Items } from '@components';
import { dzikirs } from '@data';
import { capitalize } from '@utils';

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
