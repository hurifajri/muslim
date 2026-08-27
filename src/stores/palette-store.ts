import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { type ColorPaletteId, DEFAULT_PALETTE } from '@/data/color-palettes';
import { cookieStorage } from '@/lib/cookie-storage';

export type PaletteState = {
  paletteId: ColorPaletteId;
};

export type PaletteActions = {
  setPaletteId: (id: ColorPaletteId) => void;
};

export type PaletteStore = PaletteState & PaletteActions;

export const defaultPaletteState: PaletteState = {
  paletteId: DEFAULT_PALETTE,
};

export const PALETTE_COOKIE_NAME = 'muslim-palette';

export const createPaletteStore = (
  initState: PaletteState = defaultPaletteState
) => {
  return createStore<PaletteStore>()(
    persist(
      set => ({
        ...initState,
        setPaletteId: id => set({ paletteId: id }),
      }),
      {
        name: PALETTE_COOKIE_NAME,
        storage: createJSONStorage(() => cookieStorage),
      }
    )
  );
};
