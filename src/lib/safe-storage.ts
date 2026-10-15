import type { StateStorage } from 'zustand/middleware';

// Private browsing / full storage must not prevent reading or counting.
export const safeStorage = {
  getItem: (name: string) => {
    try {
      return typeof window === 'undefined'
        ? null
        : window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // In-memory state remains usable when persistence is unavailable.
    }
  },
  removeItem: (name: string) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Storage is optional.
    }
  },
} satisfies StateStorage;
