import {
  boolean,
  fallback,
  type InferOutput,
  literal,
  maxValue,
  minValue,
  number,
  object,
  optional,
  pipe,
  record,
  string,
  union,
} from 'valibot';

export const SettingKeySchema = union([
  literal('counter'),
  literal('translation'),
  literal('transliteration'),
  literal('benefits'),
  literal('clickSound'),
]);
export type SettingKey = InferOutput<typeof SettingKeySchema>;

export const DEFAULT_FONT_SIZES = { arabic: 24, translation: 16 };
export const FONT_SIZE_RANGES = {
  arabic: { min: 20, max: 48 },
  translation: { min: 14, max: 24 },
} as const;
export type FontSizeKey = keyof typeof DEFAULT_FONT_SIZES;
const FontSizesSchema = object({
  arabic: pipe(number(), minValue(20), maxValue(48)),
  translation: pipe(number(), minValue(14), maxValue(24)),
});

export const SettingsStateSchema = object({
  settings: record(string(), boolean()),
  fontSizes: optional(
    fallback(FontSizesSchema, DEFAULT_FONT_SIZES),
    DEFAULT_FONT_SIZES
  ),
});
export type SettingsState = InferOutput<typeof SettingsStateSchema>;
