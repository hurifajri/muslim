// Eksternal
import { ReactNode } from 'react';

export interface IfProps {
  children: ReactNode;
  condition: boolean | null | string | undefined;
}
