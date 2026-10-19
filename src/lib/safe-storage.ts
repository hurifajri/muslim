type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Keep failed keys in memory for this page lifetime; never flush stale data later. */
export function createSafeStorage(
  getStorage: () => BrowserStorage | undefined
) {
  const memory = new Map<string, string>();
  const temporary = new Set<string>();
  const listeners = new Set<() => void>();
  const markTemporary = (key: string) => {
    if (temporary.has(key)) return;
    temporary.add(key);
    listeners.forEach(listener => listener());
  };

  return {
    getItem(key: string) {
      if (!temporary.has(key)) {
        try {
          const storage = getStorage();
          if (storage) {
            const value = storage.getItem(key);
            if (value === null) memory.delete(key);
            else memory.set(key, value);
          }
        } catch {
          markTemporary(key);
        }
      }
      return memory.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      memory.set(key, value);
      if (temporary.has(key)) return;
      try {
        getStorage()?.setItem(key, value);
      } catch {
        markTemporary(key);
      }
    },
    removeItem(key: string) {
      memory.delete(key);
      if (temporary.has(key)) return;
      try {
        getStorage()?.removeItem(key);
      } catch {
        markTemporary(key);
      }
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    isTemporary: (key: string) => temporary.has(key),
  };
}

export const safeStorage = createSafeStorage(() =>
  typeof window === 'undefined' ? undefined : window.localStorage
);
