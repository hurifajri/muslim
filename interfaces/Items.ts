// Internal
import { Benefit } from '@interfaces/Benefits';

interface ContentItem {
  id: number;
  arabic: string;
  transliteration: string | null;
  translation: string;
  narrator: string | null;
  benefits: Benefit[] | null;
}

interface ParentItem {
  id: number;
  title: string;
  note: string | null;
  category: string[];
  items: ContentItem[];
}

export interface Items {
  items: ParentItem[];
  category: string;
}
