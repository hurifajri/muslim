import { safeParse } from 'valibot';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import {
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
};

export type SettingsStore = SettingsState & SettingsActions;

export const defaultInitState: SettingsState = {
  settings: {
    counter: true,
    clickSound: false,
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
        merge: (persistedState, currentState) => {
          const parsed = safeParse(SettingsStateSchema, persistedState);
          if (!parsed.success) return currentState;

          return {
            ...currentState,
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
