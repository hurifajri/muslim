import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { cookieStorage } from '@/lib/cookie-storage';
import type { LocationState } from '@/schemas/location';

export type LocationActions = {
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
};

export type LocationStore = LocationState & LocationActions;

export const defaultLocationState: LocationState = {
  city: 'bogor',
  country: 'ID',
};

export const LOCATION_COOKIE_NAME = 'muslim-location';

export const createLocationStore = (
  initState: LocationState = defaultLocationState
) => {
  return createStore<LocationStore>()(
    persist(
      set => ({
        ...initState,
        setCity: city => set({ city }),
        setCountry: country => set({ country }),
      }),
      {
        name: LOCATION_COOKIE_NAME,
        storage: createJSONStorage(() => cookieStorage),
      }
    )
  );
};
