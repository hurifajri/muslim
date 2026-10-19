import { queryOptions } from '@tanstack/react-query';

import {
  fetchReverseGeocode,
  fetchSearchLocations,
} from '@/services/nominatim';

export const searchLocationsQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ['nominatim-search', query],
    queryFn: ({ signal }) => fetchSearchLocations(query, signal),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

export const reverseGeocodeQueryOptions = (lat: number, lon: number) =>
  queryOptions({
    queryKey: ['nominatim-reverse', lat, lon],
    queryFn: ({ signal }) => fetchReverseGeocode(lat, lon, signal),
    staleTime: 1000 * 60 * 60,
  });
