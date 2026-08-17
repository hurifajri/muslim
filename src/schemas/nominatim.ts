import { type InferOutput, number, object, optional, string } from 'valibot';

export const NominatimAddressSchema = object({
  city: optional(string()),
  town: optional(string()),
  village: optional(string()),
  county: optional(string()),
  country: optional(string()),
  country_code: optional(string()),
});

export const NominatimResultSchema = object({
  place_id: number(),
  display_name: string(),
  address: NominatimAddressSchema,
  type: string(),
  importance: number(),
});
export type NominatimResult = InferOutput<typeof NominatimResultSchema>;

export const LocationSuggestionSchema = object({
  placeId: number(),
  displayName: string(),
  city: string(),
  country: string(),
  countryCode: string(),
});
export type LocationSuggestion = InferOutput<typeof LocationSuggestionSchema>;
