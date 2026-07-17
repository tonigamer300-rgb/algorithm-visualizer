import { useCallback, useEffect, useState } from 'react';

/**
 * Persisted state hook backed by localStorage. Falls back gracefully when
 * storage is unavailable (e.g. private mode) and keeps the tab in sync.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const read = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  }, [key, initial]);

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
