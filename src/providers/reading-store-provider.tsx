'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { createReadingStore } from '@/stores/reading-store';

type Store = ReturnType<typeof createReadingStore>;
const ReadingContext = createContext<Store | undefined>(undefined);

export function ReadingStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createReadingStore());
  useEffect(() => {
    void Promise.resolve(store.persist.rehydrate()).then(() =>
      store.setState({ hydrated: true })
    );
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
