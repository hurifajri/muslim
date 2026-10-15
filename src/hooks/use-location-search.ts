import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { searchLocationsQueryOptions } from '@/queries/nominatim';

export function useLocationSearch(query: string, enabled: boolean) {
  const [debounced, setDebounced] = useState('');
  const term = query.trim();
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term), 400);
    return () => clearTimeout(timer);
  }, [term]);
  // Changing/clearing the input immediately removes the old observer and aborts its request.
  const activeTerm =
    enabled && term === debounced && term.length >= 2 ? term : '';
  const search = useQuery({
    ...searchLocationsQueryOptions(activeTerm),
    enabled: Boolean(activeTerm),
  });
  return {
    suggestions: activeTerm ? (search.data ?? []) : [],
    isSearching:
      enabled && term.length >= 2 && (!activeTerm || search.isFetching),
    isError: Boolean(activeTerm && search.isError),
    isEmpty: Boolean(
      activeTerm && search.isSuccess && search.data.length === 0
    ),
    retry: () => void search.refetch(),
  };
}
