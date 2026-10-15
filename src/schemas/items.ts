import {
  array,
  type InferOutput,
  integer,
  minValue,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
} from 'valibot';

import { categories } from '@/data/categories';

export const CategorySchema = picklist(categories.map(item => item.slug));
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
  repetitions: optional(pipe(number(), integer(), minValue(1))),
  categories: array(CategorySchema),
  items: array(ContentItemSchema),
});
export type ParentItem = InferOutput<typeof ParentItemSchema>;
