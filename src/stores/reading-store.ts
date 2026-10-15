import {
  boolean,
  integer,
  minValue,
  number,
  object,
  optional,
  pipe,
  record,
  safeParse,
  string,
} from 'valibot';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { safeStorage } from '@/lib/safe-storage';

const CountsSchema = record(string(), pipe(number(), integer(), minValue(0)));
const SavedSchema = object({
  counts: CountsSchema,
  undoCounts: optional(CountsSchema, {}),
  favorites: optional(record(string(), boolean()), {}),
  undoSessions: optional(record(string(), CountsSchema), {}),
});

type ReadingStore = {
  counts: Record<string, number>;
  undoCounts: Record<string, number>;
  hydrated: boolean;
  favorites: Record<string, boolean>;
  undoSessions: Record<string, Record<string, number>>;
  increment: (id: string, target?: number) => void;
  reset: (id: string) => void;
  undoReset: (id: string) => void;
  toggleFavorite: (id: string) => void;
  resetSession: (scope: string) => void;
  undoSession: (scope: string) => void;
};

export function createReadingStore(storage: StateStorage = safeStorage) {
  return createStore<ReadingStore>()(
    persist(
      set => ({
        counts: {},
        undoCounts: {},
        hydrated: false,
        favorites: {},
        undoSessions: {},
        increment: (id, target) =>
          set(state => {
            const undoCounts = { ...state.undoCounts };
            const undoSessions = { ...state.undoSessions };
            delete undoCounts[id];
            delete undoSessions[id.split(':').slice(0, 2).join(':')];
            return {
              counts: {
                ...state.counts,
                [id]: Math.min(
                  (state.counts[id] ?? 0) + 1,
                  target ?? Number.MAX_SAFE_INTEGER
                ),
              },
              undoCounts,
              undoSessions,
            };
          }),
        reset: id =>
          set(state => ({
            counts: { ...state.counts, [id]: 0 },
            undoCounts: { ...state.undoCounts, [id]: state.counts[id] ?? 0 },
          })),
        undoReset: id =>
          set(state => {
            if (state.undoCounts[id] === undefined) return state;
            const undoCounts = { ...state.undoCounts };
            delete undoCounts[id];
            return {
              counts: { ...state.counts, [id]: state.undoCounts[id] },
              undoCounts,
            };
          }),
        toggleFavorite: id =>
          set(state => {
            const favorites = { ...state.favorites };
            if (favorites[id]) delete favorites[id];
            else favorites[id] = true;
            return { favorites };
          }),
        resetSession: scope =>
          set(state => {
            const snapshot = Object.fromEntries(
              Object.entries(state.counts).filter(([id]) =>
                id.startsWith(`${scope}:`)
              )
            );
            const counts = { ...state.counts };
            const undoCounts = { ...state.undoCounts };
            for (const id of Object.keys(snapshot)) {
              counts[id] = 0;
              delete undoCounts[id];
            }
            return {
              counts,
              undoCounts,
              undoSessions: { ...state.undoSessions, [scope]: snapshot },
            };
          }),
        undoSession: scope =>
          set(state => {
            if (!state.undoSessions[scope]) return state;
            const counts = { ...state.counts, ...state.undoSessions[scope] };
            const undoSessions = { ...state.undoSessions };
            delete undoSessions[scope];
            return { counts, undoSessions };
          }),
      }),
      {
        name: 'muslim-reading',
        storage: createJSONStorage(() => storage),
        skipHydration: true,
        partialize: ({ counts, undoCounts, favorites, undoSessions }) => ({
          counts,
          undoCounts,
          favorites,
          undoSessions,
        }),
        merge: (saved, current) => {
          const parsed = safeParse(SavedSchema, saved);
          return parsed.success ? { ...current, ...parsed.output } : current;
        },
      }
    )
  );
}
