import type { ArrayFrame, HighlightKind } from '@/types';

/**
 * Helper for building array frames while keeping algorithm code readable.
 * Each algorithm records a snapshot of the array plus which indices are being
 * compared / swapped / marked sorted, and a short natural-language description.
 */
export class FrameRecorder {
  private frames: ArrayFrame[] = [];

  constructor(private readonly base: number[]) {}

  push(
    array: number[],
    highlights: Record<number, HighlightKind>,
    description: string,
    pointers?: { label: string; index: number }[]
  ): void {
    this.frames.push({
      array: [...array],
      highlights: { ...highlights },
      description,
      ...(pointers ? { pointers } : {}),
    });
  }

  get result(): ArrayFrame[] {
    // Always start with a clean "initial" frame for a consistent reset state.
    if (this.frames.length === 0) {
      this.frames.push({ array: [...this.base], highlights: {}, description: 'Initial array.' });
    }
    return this.frames;
  }
}

/** Mark every index of an array as sorted (used for the final frame). */
export function allSorted(array: number[]): Record<number, HighlightKind> {
  return Object.fromEntries(array.map((_, i) => [i, 'sorted' as HighlightKind]));
}

/**
 * Turn a list of conceptual steps into frames so the placeholder visualizer can
 * be driven by the same play/pause/step controls as the animated ones. Each
 * frame carries only a description; the placeholder renders it prominently.
 */
export function stepsToFrames(steps: string[]): ArrayFrame[] {
  return steps.map((description) => ({ array: [], highlights: {}, description }));
}
