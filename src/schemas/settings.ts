import {
  boolean,
  type InferOutput,
  literal,
  object,
  optional,
  record,
  string,
  union,
} from 'valibot';

export const SettingKeySchema = union([
  literal('counter'),
  literal('translation'),
  literal('transliteration'),
  literal('benefits'),
]);
export type SettingKey = InferOutput<typeof SettingKeySchema>;

export const ColorPaletteIdSchema = union([
  literal('sakura'),
  literal('lavender'),
  literal('rose'),
  literal('sunflower'),
  literal('forget-me-not'),
  literal('jasmine'),
  literal('marigold'),
  literal('jade'),
  literal('dahlia'),
  literal('magnolia'),
]);

export const SettingsStateSchema = object({
  settings: record(string(), boolean()),
  paletteId: optional(ColorPaletteIdSchema),
});
export type SettingsState = InferOutput<typeof SettingsStateSchema>;
