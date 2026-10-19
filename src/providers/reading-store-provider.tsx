'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { subscribeToStorage, withStorageLock } from '@/lib/storage-sync';
import { createReadingStore } from '@/stores/reading-store';

type Store = ReturnType<typeof createReadingStore>;
const ReadingContext = createContext<Store | undefined>(undefined);

type ReadingStoreProviderProps = Readonly<{ children: ReactNode }>;

export function ReadingStoreProvider({ children }: ReadingStoreProviderProps) {
  const [store] = useState(() => createReadingStore());
  useEffect(() => {
    const refresh = () => {
      void withStorageLock('muslim-reading', () => store.persist.rehydrate());
    };
    refresh();
    return subscribeToStorage('muslim-reading', refresh);
  }, [store]);
  return (
    <ReadingContext.Provider value={store}>{children}</ReadingContext.Provider>
  );
}

export function useReadingStore<T>(
  selector: (state: ReturnType<Store['getState']>) => T
): T {
  const store = useContext(ReadingContext);
  if (!store) throw new Error('ReadingStoreProvider is required');
  return useStore(store, selector);
}
