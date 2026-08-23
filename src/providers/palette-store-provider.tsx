'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { COLOR_PALETTES } from '@/data/color-palettes';
import {
  createPaletteStore,
  type PaletteState,
  type PaletteStore,
} from '@/stores/palette-store';

export type PaletteStoreApi = ReturnType<typeof createPaletteStore>;

const PaletteStoreContext = createContext<PaletteStoreApi | undefined>(
  undefined
);

export type PaletteStoreProviderProps = Readonly<{
  children: ReactNode;
  initialState: PaletteState;
}>;

export const PaletteStoreProvider = ({
  children,
  initialState,
}: PaletteStoreProviderProps) => {
  const [store] = useState(() => createPaletteStore(initialState));

  useEffect(() => {
    const syncPalette = (paletteId: string | undefined) => {
      const target = document.body;

      // Remove all existing palette classes
      for (const palette of COLOR_PALETTES) {
        target.classList.remove(`palette-${palette.id}`);
      }

      // Add the current palette class
      if (paletteId) {
        target.classList.add(`palette-${paletteId}`);

        // Auto-set light/dark theme based on palette mode manually
        const paletteData = COLOR_PALETTES.find(p => p.id === paletteId);
        if (paletteData) {
          if (paletteData.mode === 'dark') {
            target.classList.add('dark');
          } else {
            target.classList.remove('dark');
          }
        }
      }
    };

    const unsub = store.subscribe(state => {
      syncPalette(state.paletteId);
    });

    syncPalette(store.getState().paletteId);

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
  const context = useContext(PaletteStoreContext);
  if (!context) {
    throw new Error('usePaletteStore must be used within PaletteStoreProvider');
  }

  return useStore(context, selector);
};
