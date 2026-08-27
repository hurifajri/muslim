import {
  boolean,
  type InferOutput,
  literal,
  object,
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

export const SettingsStateSchema = object({
  settings: record(string(), boolean()),
});
export type SettingsState = InferOutput<typeof SettingsStateSchema>;
