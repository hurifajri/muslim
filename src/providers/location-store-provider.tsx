'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

import type { LocationState } from '@/schemas/location';
import {
  createLocationStore,
  type LocationStore,
} from '@/stores/location-store';

export type LocationStoreApi = ReturnType<typeof createLocationStore>;

const LocationStoreContext = createContext<LocationStoreApi | undefined>(
  undefined
);

export type LocationStoreProviderProps = Readonly<{
  children: ReactNode;
  initialState: LocationState;
}>;

/**
 * Provides location store to the component tree.
 * Accepts `initialState` from the server (read from cookies)
 * so the first render matches the persisted user preference — no flash.
 */
export const LocationStoreProvider = ({
  children,
  initialState,
}: LocationStoreProviderProps) => {
  const [store] = useState(() => createLocationStore(initialState));

  return (
    <LocationStoreContext.Provider value={store}>
      {children}
    </LocationStoreContext.Provider>
  );
};

export const useLocationStore = <T,>(
  selector: (store: LocationStore) => T
): T => {
  const context = useContext(LocationStoreContext);
  if (!context) {
    throw new Error(
      'useLocationStore must be used within LocationStoreProvider'
    );
  }

  return useStore(context, selector);
};
