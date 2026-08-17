'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

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
