// Internal
import { iBenefit } from '@interfaces';
interface iCitem {
  id: number;
  arabic: string;
  transliteration: string | null;
  translation: string;
  narrator: string | null;
  benefits: iBenefit[] | null;
}

interface iPitem {
  id: number;
  title: string;
  note: string | null;
  category: string[];
  items: iCitem[];
}

interface iItems {
  items: iPitem[];
  category: string;
}

export default iItems;
