// Eksternal
import { ChangeEvent } from 'react';

export interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export type Setting = Record<string, {
  name: string;
  label: string;
  isActive: boolean;
}>;

export type HandleChangeSetting = ChangeEvent<HTMLInputElement>;
