import { safeParse } from 'valibot';
import { persist, type StateStorage } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { createPersistStorage } from '@/lib/persist-storage';
import { safeStorage } from '@/lib/safe-storage';
import { withStorageLock } from '@/lib/storage-sync';
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
  { name: 'counter', label: 'Tombol hitung' },
  { name: 'clickSound', label: 'Bunyi klik' },
  { name: 'translation', label: 'Terjemahan' },
  { name: 'transliteration', label: 'Transliterasi' },
  { name: 'benefits', label: 'Keutamaan' },
];

export type SettingsActions = {
  setSettings: (name: SettingKey, isActive: boolean) => Promise<void>;
  setFontSize: (name: FontSizeKey, size: number) => Promise<void>;
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
  const store = createStore<SettingsStore>()(
    persist(
      () => ({
        ...initState,
        setFontSize: (name, size) =>
          mutate(state => ({
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
          mutate(state => ({
            settings: {
              ...state.settings,
              [name]: isActive,
            },
          })),
      }),
      {
        name: 'muslim-settings',
        storage: createPersistStorage(storage),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          if (persistedState === undefined)
            return { ...currentState, ...initState };
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

  function mutate(
    update: (state: SettingsStore) => Partial<SettingsStore>
  ): Promise<void> {
    // Reload inside the shared lock before applying an update, preserving preferences changed in another tab.
    return withStorageLock('muslim-settings', async () => {
      await store.persist.rehydrate();
      store.setState(update);
    });
  }
  return store;
};
