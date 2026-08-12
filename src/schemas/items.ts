export type Category = 'pagi' | 'petang' | 'quran' | 'nabi' | 'sholat';

export type Benefit = {
  id: number;
  translation: string;
  narrator: string;
};

type ContentItem = {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  narrator: string;
  benefits: Benefit[];
};

export type ParentItem = {
  id: number;
  title: string;
  note: string;
  categories: Category[];
  items: ContentItem[];
};
