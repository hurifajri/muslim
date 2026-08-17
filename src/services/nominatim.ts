import { env } from '@/env';
import type { LocationSuggestion, NominatimResult } from '@/schemas/nominatim';

function extractCity(address: NominatimResult['address']): string {
  return (
    address.city || address.town || address.village || address.county || ''
  );
}

export async function fetchSearchLocations(
  query: string
): Promise<LocationSuggestion[]> {
  if (query.trim().length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '6',
    featuretype: 'city',
  });

  const res = await fetch(
    `${env.NEXT_PUBLIC_NOMINATIM_API_URL}/search?${params}`,
    { headers: { 'Accept-Language': 'en' } }
  );

  if (!res.ok) return [];

  const results: NominatimResult[] = await res.json();

  return results
    .map(r => ({
      placeId: r.place_id,
      displayName: r.display_name,
      city: extractCity(r.address),
      country: r.address.country ?? '',
      countryCode: (r.address.country_code ?? '').toUpperCase(),
    }))
    .filter(r => r.city && r.countryCode);
}

export async function fetchReverseGeocode(
  lat: number,
  lon: number
): Promise<LocationSuggestion | null> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_NOMINATIM_API_URL}/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) return null;
  const data: NominatimResult = await res.json();
  const city = extractCity(data.address);
  const countryCode = (data.address.country_code ?? '').toUpperCase();
  if (!city || !countryCode) return null;
  return {
    placeId: data.place_id,
    displayName: data.display_name,
    city,
    country: data.address.country ?? '',
    countryCode,
  };
}
