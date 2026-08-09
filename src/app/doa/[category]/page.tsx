'use client';

import { useParams } from 'next/navigation';

import { Items } from '@/components/items';
import { doas } from '@/data/doas';

const Doa = () => {
  const params = useParams();
  const category = Array.isArray(params?.category)
    ? params.category[0]
    : (params?.category ?? '');

  const filteredDoas = doas.filter(doa => doa.category.includes(category));

  return (
    <>
      <Items items={filteredDoas} />
    </>
  );
};

export default Doa;
