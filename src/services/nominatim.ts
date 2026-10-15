import { array, parse } from 'valibot';

import { env } from '@/env';
import {
  formatCityName,
  formatCountryName,
  formatLocationLabel,
} from '@/lib/location-display';
import {
  type LocationSuggestion,
  type NominatimResult,
  NominatimResultSchema,
} from '@/schemas/nominatim';

function toSuggestion(result: NominatimResult): LocationSuggestion | null {
  const { address, namedetails } = result;
  const city = formatCityName(
    namedetails?.['_place_name:id'] ||
      namedetails?.['_place_name:en'] ||
      namedetails?.['_place_name'] ||
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      address.state ||
      ''
  );
  const countryCode = (address.country_code ?? '').trim().toUpperCase();
  if (!city || !countryCode) return null;
  return {
    placeId: result.place_id,
    displayName: formatLocationLabel(city, countryCode),
    city,
    country: formatCountryName(countryCode),
    countryCode,
  };
}

export async function fetchSearchLocations(
  query: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> {
  if (query.trim().length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    namedetails: '1',
    limit: '6',
    featureType: 'city',
    'accept-language': 'id,en',
  });

  const res = await fetch(
    `${env.NEXT_PUBLIC_NOMINATIM_API_URL}/search?${params}`,
    { signal }
  );

  if (!res.ok) throw new Error(`Pencarian lokasi gagal (${res.status}).`);

  const results = parse(array(NominatimResultSchema), await res.json());

  const suggestions = new Map<string, LocationSuggestion>();
  for (const result of results) {
    const suggestion = toSuggestion(result);
    if (!suggestion) continue;
    // The prayer lookup identifies a place by city and country, not OSM object ID.
    const key = `${suggestion.city.toLocaleLowerCase('id-ID')}:${suggestion.countryCode}`;
    if (!suggestions.has(key)) suggestions.set(key, suggestion);
  }
  return [...suggestions.values()];
}

export async function fetchReverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<LocationSuggestion | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'jsonv2',
    addressdetails: '1',
    namedetails: '1',
    zoom: '10',
    'accept-language': 'id,en',
  });
  const res = await fetch(
    `${env.NEXT_PUBLIC_NOMINATIM_API_URL}/reverse?${params}`,
    { signal }
  );
  if (!res.ok) throw new Error(`Pencarian koordinat gagal (${res.status}).`);
  const data = parse(NominatimResultSchema, await res.json());
  return toSuggestion(data);
}
