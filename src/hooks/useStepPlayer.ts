import { useCallback, useEffect, useRef, useState } from 'react';

interface StepPlayerOptions {
  total: number;
  /** Base playback speed multiplier (from user settings). */
  speed: number;
}

/**
 * Frame-based playback engine shared by every visualizer. It owns only an index
 * into a precomputed frame list, which makes play, pause, step-forward,
 * step-back, reset and scrubbing trivial and fully deterministic.
 *
 * A requestAnimationFrame loop advances the index based on elapsed time so
 * playback stays smooth (and speed changes apply instantly) regardless of frame
 * count.
 */
export function useStepPlayer({ total, speed }: StepPlayerOptions) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const clamp = useCallback((i: number) => Math.max(0, Math.min(total - 1, i)), [total]);

  const stepForward = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const stepBack = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);
  const goTo = useCallback((i: number) => setIndex(clamp(i)), [clamp]);
  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  const play = useCallback(() => {
    // Restart from the beginning if we're already at the end.
    setIndex((i) => (i >= total - 1 ? 0 : i));
    setIsPlaying(true);
  }, [total]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => (isPlaying ? pause() : play()), [isPlaying, pause, play]);

  // Keep the index valid when the frame list changes (new data / new algorithm).
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, total - 1)));
  }, [total]);

  useEffect(() => {
    if (!isPlaying) return;

    // Frames-per-second scales with the speed multiplier; clamp so it stays
    // watchable at the low end and smooth at the high end.
    const fps = Math.min(60, Math.max(2, 6 * speed));
    const interval = 1000 / fps;

    const loop = (now: number) => {
      if (now - lastTickRef.current >= interval) {
        lastTickRef.current = now;
        setIndex((i) => {
          if (i >= total - 1) {
            setIsPlaying(false);
            return i;
          }
          return i + 1;
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed, total]);

  return {
    index,
    isPlaying,
    isFirst: index === 0,
    isLast: index >= total - 1,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    goTo,
    reset,
  };
}
