import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import type { SettingKey, SettingsState } from '@/schemas/settings';

export type { SettingKey, SettingsState };

export const SETTINGS_CONFIG: { name: SettingKey; label: string }[] = [
  { name: 'darkMode', label: 'Mode Gelap' },
  { name: 'counter', label: 'Tombol Hitung' },
  { name: 'translation', label: 'Terjemahan' },
  { name: 'transliteration', label: 'Transliterasi' },
  { name: 'benefits', label: 'Keutamaan' },
];

export type SettingsActions = {
  setSettings: (name: SettingKey, isActive: boolean) => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const defaultInitState: SettingsState = {
  settings: {
    darkMode: false,
    counter: true,
    translation: true,
    transliteration: false,
    benefits: true,
  },
};

export const createSettingsStore = (
  initState: SettingsState = defaultInitState
) => {
  return createStore<SettingsStore>()(
    persist(
      set => ({
        ...initState,
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
      }
    )
  );
};
