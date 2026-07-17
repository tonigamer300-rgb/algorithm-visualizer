import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Settings {
  /** Playback speed multiplier for animations. */
  speed: number;
  /** Default number of elements in generated data sets. */
  arraySize: number;
  /** Accent color applied via the --brand CSS variable. */
  primaryColor: string;
  soundEffects: boolean;
  reducedMotion: boolean;
}

const DEFAULTS: Settings = {
  speed: 1,
  arraySize: 24,
  primaryColor: '#3B82F6',
  soundEffects: false,
  reducedMotion: false,
};

interface SettingsContextValue {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  completed: string[];
  markCompleted: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('av:settings', DEFAULTS);
  const [favorites, setFavorites] = useLocalStorage<string[]>('av:favorites', []);
  const [completed, setCompleted] = useLocalStorage<string[]>('av:completed', []);

  // Apply the accent color and reduced-motion class to the document so plain
  // CSS (and Tailwind's channel-based brand color) picks them up everywhere.
  useEffect(() => {
    const hex = settings.primaryColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const root = document.documentElement.style;
    root.setProperty('--brand', settings.primaryColor);
    root.setProperty('--brand-rgb', `${r} ${g} ${b}`);
  }, [settings.primaryColor]);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    document.documentElement.classList.toggle(
      'reduce-motion',
      settings.reducedMotion || prefersReduced
    );
  }, [settings.reducedMotion]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (key, val) => setSettings((s) => ({ ...s, [key]: val })),
      reset: () => setSettings(DEFAULTS),
      favorites,
      toggleFavorite: (id) =>
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      completed,
      markCompleted: (id) => setCompleted((c) => (c.includes(id) ? c : [...c, id])),
    }),
    [settings, favorites, completed, setSettings, setFavorites, setCompleted]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
