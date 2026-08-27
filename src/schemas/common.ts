import {
  type InferOutput,
  literal,
  number,
  object,
  string,
  union,
} from 'valibot';

export const QuoteSchema = object({
  id: number(),
  quote: string(),
  narrator: string(),
});
export type Quote = InferOutput<typeof QuoteSchema>;

export const TocCategorySchema = union([literal('dzikir'), literal('doa')]);
export type TocCategory = InferOutput<typeof TocCategorySchema>;

export const TocSchema = object({
  id: number(),
  title: string(),
  link: string(),
  category: TocCategorySchema,
});
export type Toc = InferOutput<typeof TocSchema>;

export const SourceSchema = object({
  id: number(),
  title: string(),
  url: string(),
});
export type Source = InferOutput<typeof SourceSchema>;
