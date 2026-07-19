// Eksternal
import { ChangeEvent } from 'react';

export interface LocationProps {
  isOpen: boolean;
  onClose: () => void;
}

export type HandleChangeLocation = ChangeEvent<HTMLInputElement>;
