// Eksternal
import useSWR from 'swr';

// Internal
import { TocSwrResponse } from '@/interfaces';

const useToc = (): TocSwrResponse => {
  const { data, error } = useSWR('/api/toc');

  return {
    contents: data,
    isError: error,
    isLoading: !data && !error,
  };
};

export default useToc;
