import type { StateStorage } from 'zustand/middleware';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Zustand-compatible storage adapter that persists to cookies.
 * Only use for small, server-readable state (e.g. city + country).
 */
export const cookieStorage: StateStorage = {
  getItem(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const match = new RegExp(`(?:^|; )${name}=([^;]*)`).exec(document.cookie);
    return match ? decodeURIComponent(match[1]) : null;
  },

  setItem(name: string, value: string): void {
    if (typeof document === 'undefined') return;

    document.cookie = [
      `${name}=${encodeURIComponent(value)}`,
      `path=/`,
      `max-age=${COOKIE_MAX_AGE}`,
      `SameSite=Lax`,
    ].join('; ');
  },

  removeItem(name: string): void {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=; path=/; max-age=0`;
  },
};
