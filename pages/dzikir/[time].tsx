// Eksternal
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// Internal
import { Items } from '@components';
import { dzikirs } from '@data';
import { capitalize } from '@utils';

const Dzikir: NextPage = () => {
  const { query } = useRouter();
  const time = Array.isArray(query.time) ? query.time[0] : query.time ?? '';

  return (
    <>
      <NextSeo
        title={`Muslim • Dzikir ${capitalize(time)}`}
        description="Dzikir Pagi Sesuai Sunnah."
      />
      <Items items={dzikirs} timeOrType={{ label: 'times', data: time }} />
    </>
  );
};

export default Dzikir;
