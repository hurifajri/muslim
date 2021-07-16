import { SetStateAction } from 'react';

interface iLocation {
  isOpen: boolean;
  onClose: () => void;
}

export interface iHandleChangeLocation {
  target: { value: SetStateAction<string> };
}

export default iLocation;
