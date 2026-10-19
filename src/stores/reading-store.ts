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
import { persist, type StateStorage } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { createPersistStorage } from '@/lib/persist-storage';
import { safeStorage } from '@/lib/safe-storage';
import { withStorageLock } from '@/lib/storage-sync';

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
  increment: (id: string, target?: number) => Promise<void>;
  reset: (id: string) => Promise<void>;
  undoReset: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<boolean>;
  resetSession: (scope: string) => Promise<void>;
  undoSession: (scope: string) => Promise<void>;
};

export function createReadingStore(storage: StateStorage = safeStorage) {
  const store = createStore<ReadingStore>()(
    persist(
      (): ReadingStore => ({
        counts: {},
        undoCounts: {},
        hydrated: false,
        favorites: {},
        undoSessions: {},
        increment: (id, target) =>
          mutate(state => {
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
          mutate(state => ({
            counts: { ...state.counts, [id]: 0 },
            undoCounts: { ...state.undoCounts, [id]: state.counts[id] ?? 0 },
          })),
        undoReset: id =>
          mutate(state => {
            if (state.undoCounts[id] === undefined) return state;
            const undoCounts = { ...state.undoCounts };
            delete undoCounts[id];
            return {
              counts: { ...state.counts, [id]: state.undoCounts[id] },
              undoCounts,
            };
          }),
        toggleFavorite: async id => {
          let favorite = false;
          await mutate(state => {
            const favorites = { ...state.favorites };
            if (favorites[id]) delete favorites[id];
            else favorites[id] = true;
            favorite = favorites[id] ?? false;
            return { favorites };
          });
          return favorite;
        },
        resetSession: scope =>
          mutate(state => {
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
          mutate(state => {
            if (!state.undoSessions[scope]) return state;
            const counts = { ...state.counts, ...state.undoSessions[scope] };
            const undoSessions = { ...state.undoSessions };
            delete undoSessions[scope];
            return { counts, undoSessions };
          }),
      }),
      {
        name: 'muslim-reading',
        storage: createPersistStorage(storage),
        skipHydration: true,
        partialize: ({ counts, undoCounts, favorites, undoSessions }) => ({
          counts,
          undoCounts,
          favorites,
          undoSessions,
        }),
        merge: (saved, current) => {
          if (saved === undefined)
            return {
              ...current,
              counts: {},
              favorites: {},
              undoCounts: {},
              undoSessions: {},
              hydrated: true,
            };
          const parsed = safeParse(SavedSchema, saved);
          return {
            ...current,
            ...(parsed.success ? parsed.output : {}),
            hydrated: true,
          };
        },
      }
    )
  );

  function mutate(
    update: (state: ReadingStore) => Partial<ReadingStore>
  ): Promise<void> {
    // Reload inside the shared lock before applying an update, so stale tabs cannot overwrite each other.
    return withStorageLock('muslim-reading', async () => {
      await store.persist.rehydrate();
      store.setState(update);
    });
  }
  return store;
}
