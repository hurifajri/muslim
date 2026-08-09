import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export type SettingKey =
  'arabic' | 'counter' | 'translation' | 'transliteration' | 'benefits';

export const SETTINGS_CONFIG: { name: SettingKey; label: string }[] = [
  { name: 'arabic', label: 'Bahasa Arab' },
  { name: 'counter', label: 'Tombol Hitung' },
  { name: 'translation', label: 'Terjemahan' },
  { name: 'transliteration', label: 'Transliterasi' },
  { name: 'benefits', label: 'Keutamaan' },
];

export type SettingsState = {
  settings: Record<SettingKey, boolean>;
  location: string;
};

export type SettingsActions = {
  setSettings: (name: SettingKey, isActive: boolean) => void;
  setLocation: (location: string) => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const defaultInitState: SettingsState = {
  settings: {
    arabic: true,
    counter: true,
    translation: true,
    transliteration: false,
    benefits: true,
  },
  location: 'bogor',
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
        setLocation: location => set({ location }),
      }),
      {
        name: 'muslim-settings',
      }
    )
  );
};
