import {
  array,
  type InferOutput,
  literal,
  number,
  object,
  string,
  union,
} from 'valibot';

export const CategorySchema = union([
  literal('pagi'),
  literal('petang'),
  literal('quran'),
  literal('nabi'),
  literal('salat'),
]);
export type Category = InferOutput<typeof CategorySchema>;

export const BenefitSchema = object({
  id: number(),
  translation: string(),
  narrator: string(),
});
export type Benefit = InferOutput<typeof BenefitSchema>;

export const ContentItemSchema = object({
  id: number(),
  arabic: string(),
  transliteration: string(),
  translation: string(),
  narrator: string(),
  benefits: array(BenefitSchema),
});
export type ContentItem = InferOutput<typeof ContentItemSchema>;

export const ParentItemSchema = object({
  id: number(),
  title: string(),
  note: string(),
  categories: array(CategorySchema),
  items: array(ContentItemSchema),
});
export type ParentItem = InferOutput<typeof ParentItemSchema>;
