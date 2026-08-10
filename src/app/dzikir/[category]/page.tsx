'use client';

import { useParams } from 'next/navigation';

import { Header } from '@/components/header';
import { Items } from '@/components/items';
import { dzikirs } from '@/data/dzikirs';

const Dzikir = () => {
  const params = useParams();
  const category = Array.isArray(params?.category)
    ? params.category[0]
    : (params?.category ?? '');

  const filteredDzikirs = dzikirs.filter(dzikir =>
    dzikir.category.includes(category)
  );

  return (
    <>
      <Header />
      <Items items={filteredDzikirs} />
    </>
  );
};

export default Dzikir;
