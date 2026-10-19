'use client';

import { useSyncExternalStore } from 'react';

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener('popstate', onChange);
  };
}

const getTarget = () => window.location.hash.slice(1);
const getServerTarget = () => null;

export function useReadingTarget() {
  // Next Link updates history without refreshing the browser's CSS :target.
  // Native fragment links and back/forward keep this snapshot up to date.
  return useSyncExternalStore<string | null>(
    subscribeToHash,
    getTarget,
    getServerTarget
  );
}
