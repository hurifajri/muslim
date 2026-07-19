// Eksternal
import { Fragment, ReactNode } from 'react';

interface IfProps {
  children: ReactNode;
  condition: boolean | null | string | undefined;
}

const If = ({ children, condition }: IfProps): JSX.Element | null => {
  if (!condition) return null;

  // render children if the condition is truthy
  return <Fragment>{children}</Fragment>;
};

export { If };
