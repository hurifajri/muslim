import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { cookieStorage } from '@/lib/cookie-storage';
import { type LocationState, LocationStateSchema } from '@/schemas/location';

export type LocationActions = {
  setLocation: (location: LocationState) => void;
  setTimeZone: (city: string, country: string, timeZone: string) => void;
};

export type LocationStore = LocationState & LocationActions;

export const defaultLocationState: LocationState = {
  city: 'bogor',
  country: 'ID',
  timeZone: 'Asia/Jakarta',
};

export const LOCATION_COOKIE_NAME = 'muslim-location';

export const createLocationStore = (
  initState: LocationState = defaultLocationState
) => {
  return createStore<LocationStore>()(
    persist(
      set => ({
        ...initState,
        setLocation: location =>
          set(state => ({
            ...location,
            timeZone:
              location.timeZone ??
              (state.city.toLowerCase() === location.city.toLowerCase() &&
              state.country.toUpperCase() === location.country.toUpperCase()
                ? state.timeZone
                : undefined),
          })),
        setTimeZone: (city, country, timeZone) =>
          set(state =>
            state.city === city && state.country === country ? { timeZone } : {}
          ),
      }),
      {
        name: LOCATION_COOKIE_NAME,
        storage: createJSONStorage(() => cookieStorage),
        merge: (saved, current) => {
          const parsed = safeParse(LocationStateSchema, saved);
          return parsed.success
            ? { ...current, ...parsed.output, timeZone: parsed.output.timeZone }
            : current;
        },
      }
    )
  );
};
import { safeParse } from 'valibot';
