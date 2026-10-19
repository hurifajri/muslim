const pending = new Map<string, Promise<unknown>>();

/** Serialize read/change/write across tabs, and within this tab on older browsers. */
export function withStorageLock<T>(key: string, action: () => T | Promise<T>) {
  const run = async () => {
    const locks =
      typeof navigator === 'undefined' ? undefined : navigator.locks;
    if (!locks) return action();
    let acquired = false;
    try {
      return await locks.request(`muslim-storage:${key}`, async () => {
        acquired = true;
        return action();
      });
    } catch (error) {
      // A denied lock API must not prevent using the app. Do not repeat an action
      // that already ran and threw, as that could apply an increment twice.
      if (acquired) throw error;
      return action();
    }
  };
  const previous = pending.get(key) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(run);
  pending.set(key, next);
  const cleanup = () => {
    if (pending.get(key) === next) pending.delete(key);
  };
  void next.then(cleanup, cleanup);
  return next;
}

export function subscribeToStorage(key: string, refresh: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) refresh();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('focus', refresh);
    window.removeEventListener('pageshow', refresh);
  };
}
