'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { COLOR_PALETTE_IDS } from '@/data/color-palettes';
import { createPaletteStore, type PaletteStore } from '@/stores/palette-store';

export type PaletteStoreApi = ReturnType<typeof createPaletteStore>;

export const PaletteStoreContext = createContext<PaletteStoreApi | undefined>(
  undefined
);

export type PaletteStoreProviderProps = Readonly<{
  children: ReactNode;
}>;

export const PaletteStoreProvider = ({
  children,
}: PaletteStoreProviderProps) => {
  const [store] = useState(() => createPaletteStore());

  // Sync the palette class to <html> element
  useEffect(() => {
    const unsub = store.subscribe(state => {
      const html = document.documentElement;
      // Remove all existing palette classes
      for (const id of COLOR_PALETTE_IDS) {
        html.classList.remove(`palette-${id}`);
      }
      // Add the current palette class
      html.classList.add(`palette-${state.paletteId}`);
    });

    // Apply initial palette
    const html = document.documentElement;
    for (const id of COLOR_PALETTE_IDS) {
      html.classList.remove(`palette-${id}`);
    }
    html.classList.add(`palette-${store.getState().paletteId}`);

    return unsub;
  }, [store]);

  return (
    <PaletteStoreContext.Provider value={store}>
      {children}
    </PaletteStoreContext.Provider>
  );
};

export const usePaletteStore = <T,>(
  selector: (store: PaletteStore) => T
): T => {
  const paletteStoreContext = useContext(PaletteStoreContext);
  if (!paletteStoreContext) {
    throw new Error(`usePaletteStore must be used within PaletteStoreProvider`);
  }

  return useStore(paletteStoreContext, selector);
};
