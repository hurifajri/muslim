import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { searchLocationsQueryOptions } from '@/queries/nominatim';

export function useLocationSearch(query: string, enabled: boolean) {
  const [submitted, setSubmitted] = useState('');
  const term = query.trim();
  const activeTerm =
    enabled && term === submitted && term.length >= 2 ? term : '';
  const search = useQuery({
    ...searchLocationsQueryOptions(activeTerm),
    enabled: Boolean(activeTerm),
  });
  return {
    suggestions: activeTerm ? (search.data ?? []) : [],
    isSearching: Boolean(activeTerm && search.isFetching),
    isError: Boolean(activeTerm && search.isError),
    errorMessage: search.error?.message.includes('terlalu cepat')
      ? search.error.message
      : 'Pencarian gagal. Periksa koneksi lalu coba lagi.',
    isEmpty: Boolean(
      activeTerm && search.isSuccess && search.data.length === 0
    ),
    retry: () => void search.refetch(),
    reset: () => setSubmitted(''),
    submit: () => {
      if (!enabled || term.length < 2 || term.length > 120) return;
      if (submitted === term) void search.refetch();
      else setSubmitted(term);
    },
  };
}
