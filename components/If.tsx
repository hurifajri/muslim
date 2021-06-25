// Internal
import { If as iIf } from '@/interfaces';

const If = ({ children, condition }: iIf): null | JSX.Element => {
  if (!condition) return null;

  // render children if the condition is truthy
  return children;
};

export default If;
