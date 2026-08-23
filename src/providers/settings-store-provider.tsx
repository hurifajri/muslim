'use client';

import { useTheme } from 'next-themes';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { COLOR_PALETTE_IDS, COLOR_PALETTES } from '@/data/color-palettes';
import {
  createSettingsStore,
  type SettingsStore,
} from '@/stores/settings-store';

export type SettingsStoreApi = ReturnType<typeof createSettingsStore>;

export const SettingsStoreContext = createContext<SettingsStoreApi | undefined>(
  undefined
);

export type SettingsStoreProviderProps = Readonly<{
  children: ReactNode;
}>;

export const SettingsStoreProvider = ({
  children,
}: SettingsStoreProviderProps) => {
  const [store] = useState(() => createSettingsStore());
  const { setTheme } = useTheme();

  // Sync palette class to <html> and auto-set light/dark theme
  useEffect(() => {
    const syncPalette = (paletteId: string | undefined) => {
      const html = document.documentElement;

      // Remove all existing palette classes
      for (const id of COLOR_PALETTE_IDS) {
        html.classList.remove(`palette-${id}`);
      }

      // Add the current palette class
      if (paletteId) {
        html.classList.add(`palette-${paletteId}`);
      }

      // Auto-set light/dark theme based on palette mode
      const palette = COLOR_PALETTES.find(p => p.id === paletteId);
      if (palette) {
        setTheme(palette.mode);
      }
    };

    // Subscribe to palette changes
    const unsub = store.subscribe(state => {
      syncPalette(state.paletteId);
    });

    // Apply initial palette
    syncPalette(store.getState().paletteId);

    return unsub;
  }, [store, setTheme]);

  return (
    <SettingsStoreContext.Provider value={store}>
      {children}
    </SettingsStoreContext.Provider>
  );
};

export const useSettingsStore = <T,>(
  selector: (store: SettingsStore) => T
): T => {
  const settingsStoreContext = useContext(SettingsStoreContext);
  if (!settingsStoreContext) {
    throw new Error(
      `useSettingsStore must be used within SettingsStoreProvider`
    );
  }

  return useStore(settingsStoreContext, selector);
};
