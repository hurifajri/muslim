import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/** Invalid JSON is absent data; hydration must still finish without rewriting it. */
export function createPersistStorage<T>(storage: StateStorage) {
  const jsonStorage = createJSONStorage<T>(() => storage)!;
  return {
    ...jsonStorage,
    async getItem(key: string) {
      try {
        return await jsonStorage.getItem(key);
      } catch {
        return null;
      }
    },
  };
}
