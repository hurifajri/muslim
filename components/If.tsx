// Eksternal
import { ReactNode } from 'react';

// Internal
import { IfProps } from '@interfaces/If';

const If = ({ children, condition }: IfProps): null | ReactNode => {
  if (!condition) return null;

  // render children if the condition is truthy
  return children;
};

export default If;
