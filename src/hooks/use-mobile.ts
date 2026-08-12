import { useMediaQuery } from '@/hooks/use-media-query';

const MOBILE_BREAKPOINT = 640;

export function useIsMobile() {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  return { isMobile };
}
