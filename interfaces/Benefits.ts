export interface Benefit {
  id: number;
  translation: string;
  narrator: string;
}

export interface BenefitsProps {
  benefits: Benefit[] | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}
