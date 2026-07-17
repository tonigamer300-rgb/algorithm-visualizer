import type { AlgorithmMeta, AlgorithmModule, Language } from '@/types';
import { stepsToFrames } from './_shared';

/**
 * Factory for algorithms that are fully documented but not yet animated. They
 * still render every educational tab (description, complexity, code, pseudocode)
 * and the step controls walk through their conceptual steps via the placeholder
 * visualizer — so adding an interactive visualizer later only means swapping the
 * `visualizer` kind and providing `generateFrames`.
 */
export function definePlaceholder(
  meta: AlgorithmMeta,
  code: Partial<Record<Language, string>>
): AlgorithmModule {
  return {
    meta,
    code,
    visualizer: 'placeholder',
    generateFrames: () => stepsToFrames([meta.description, ...meta.steps]),
  };
}
