import { useEffect } from 'react';

export interface ShortcutMap {
  [key: string]: (e: KeyboardEvent) => void;
}

/**
 * Registers global keyboard shortcuts. Keys are matched case-insensitively and
 * ignored while the user is typing in an input/textarea so we never hijack text
 * entry (e.g. the algorithm search box).
 */
export function useKeyboardShortcuts(map: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const key = e.key === ' ' ? 'space' : e.key.toLowerCase();
      const fn = map[key];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [map, enabled]);
}
