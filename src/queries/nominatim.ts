import { queryOptions } from '@tanstack/react-query';

import {
  fetchReverseGeocode,
  fetchSearchLocations,
} from '@/services/nominatim';

export const searchLocationsQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ['nominatim-search', query],
    queryFn: () => fetchSearchLocations(query),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

export const reverseGeocodeQueryOptions = (lat: number, lon: number) =>
  queryOptions({
    queryKey: ['nominatim-reverse', lat, lon],
    queryFn: () => fetchReverseGeocode(lat, lon),
    staleTime: 1000 * 60 * 60,
  });
