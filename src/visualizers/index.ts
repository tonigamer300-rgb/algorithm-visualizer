import { lazy } from 'react';
import type { LazyExoticComponent } from 'react';
import type { VisualizerComponent, VisualizerKind } from '@/types';

/**
 * Maps each visualizer kind to a lazily-loaded component so only the visualizer
 * currently on screen is shipped to the browser (route + component code split).
 */
export const VISUALIZERS: Record<VisualizerKind, LazyExoticComponent<VisualizerComponent>> = {
  array: lazy(() => import('./ArrayVisualizer')),
  graph: lazy(() => import('./GraphVisualizer')),
  grid: lazy(() => import('./GridVisualizer')),
  tree: lazy(() => import('./TreeVisualizer')),
  hanoi: lazy(() => import('./HanoiVisualizer')),
  placeholder: lazy(() => import('./PlaceholderVisualizer')),
};
