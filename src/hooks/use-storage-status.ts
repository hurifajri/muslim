'use client';

import { useSyncExternalStore } from 'react';

import { safeStorage } from '@/lib/safe-storage';

export function useStorageStatus(key: string) {
  return useSyncExternalStore(
    safeStorage.subscribe,
    () => safeStorage.isTemporary(key),
    () => false
  );
}
