export interface iBenefit {
  id: number;
  translation: string;
  narrator: string;
}

interface iBenefits {
  benefits: iBenefit[] | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default iBenefits;
