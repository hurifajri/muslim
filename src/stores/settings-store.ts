import { safeParse } from 'valibot';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { safeStorage } from '@/lib/safe-storage';
import {
  DEFAULT_FONT_SIZES,
  FONT_SIZE_RANGES,
  type FontSizeKey,
  type SettingKey,
  type SettingsState,
  SettingsStateSchema,
} from '@/schemas/settings';

export type { SettingKey, SettingsState };

export const SETTINGS_CONFIG: { name: SettingKey; label: string }[] = [
  { name: 'counter', label: 'Tombol Hitung' },
  { name: 'clickSound', label: 'Bunyi Klik' },
  { name: 'translation', label: 'Terjemahan' },
  { name: 'transliteration', label: 'Transliterasi' },
  { name: 'benefits', label: 'Keutamaan' },
];

export type SettingsActions = {
  setSettings: (name: SettingKey, isActive: boolean) => void;
  setFontSize: (name: FontSizeKey, size: number) => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const defaultInitState: SettingsState = {
  fontSizes: DEFAULT_FONT_SIZES,
  settings: {
    counter: true,
    clickSound: false,
    translation: true,
    transliteration: false,
    benefits: true,
  },
};

export const createSettingsStore = (
  initState: SettingsState = defaultInitState,
  storage: StateStorage = safeStorage
) => {
  return createStore<SettingsStore>()(
    persist(
      set => ({
        ...initState,
        setFontSize: (name, size) =>
          set(state => ({
            fontSizes: {
              ...state.fontSizes,
              [name]: Number.isFinite(size)
                ? Math.max(
                    FONT_SIZE_RANGES[name].min,
                    Math.min(FONT_SIZE_RANGES[name].max, Math.round(size))
                  )
                : DEFAULT_FONT_SIZES[name],
            },
          })),
        setSettings: (name, isActive) =>
          set(state => ({
            settings: {
              ...state.settings,
              [name]: isActive,
            },
          })),
      }),
      {
        name: 'muslim-settings',
        storage: createJSONStorage(() => storage),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          const parsed = safeParse(SettingsStateSchema, persistedState);
          if (!parsed.success) return currentState;

          return {
            ...currentState,
            fontSizes: parsed.output.fontSizes,
            settings: {
              ...currentState.settings,
              ...parsed.output.settings,
            },
          };
        },
      }
    )
  );
};
