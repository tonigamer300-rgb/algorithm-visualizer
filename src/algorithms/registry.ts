import type { AlgorithmModule, Category, CategoryMeta } from '@/types';

// --- Sorting ---
import bubbleSort from './sorting/bubbleSort';
import selectionSort from './sorting/selectionSort';
import insertionSort from './sorting/insertionSort';
import mergeSort from './sorting/mergeSort';
import quickSort from './sorting/quickSort';
import heapSort from './sorting/heapSort';
import countingSort from './sorting/countingSort';
import radixSort from './sorting/radixSort';

// --- Searching ---
import linearSearch from './searching/linearSearch';
import binarySearch from './searching/binarySearch';
import jumpSearch from './searching/jumpSearch';
import interpolationSearch from './searching/interpolationSearch';

// --- Graph ---
import bfs from './graph/bfs';
import dfs from './graph/dfs';
import graphExtras from './graph/extras';

// --- Other categories (documented; visualizers added over time) ---
import treeExtras from './trees/extras';
import recursionExtras from './recursion/extras';
import dpExtras from './dp/extras';
import backtrackingExtras from './backtracking/extras';

/**
 * The single source of truth for every algorithm in the app.
 *
 * To add a new algorithm you only need to:
 *   1. Create its module (metadata + code + optional generateFrames).
 *   2. Import it here.
 *   3. Add it to this array.
 * Nothing else in the codebase needs to change.
 */
export const ALGORITHMS: AlgorithmModule[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  linearSearch,
  binarySearch,
  jumpSearch,
  interpolationSearch,
  bfs,
  dfs,
  ...graphExtras,
  ...treeExtras,
  ...recursionExtras,
  ...dpExtras,
  ...backtrackingExtras,
];

export const CATEGORIES: CategoryMeta[] = [
  { id: 'sorting', label: 'Sorting', description: 'Arrange elements into order.' },
  { id: 'searching', label: 'Searching', description: 'Locate a value within a collection.' },
  { id: 'graph', label: 'Graph', description: 'Traverse and find paths through networks.' },
  { id: 'trees', label: 'Trees', description: 'Hierarchical structures and balancing.' },
  { id: 'recursion', label: 'Recursion', description: 'Problems defined in terms of themselves.' },
  { id: 'dp', label: 'Dynamic Programming', description: 'Solve overlapping subproblems once.' },
  { id: 'backtracking', label: 'Backtracking', description: 'Search by trying and undoing choices.' },
];

const byId = new Map(ALGORITHMS.map((a) => [a.meta.id, a]));

export function getAlgorithm(id: string): AlgorithmModule | undefined {
  return byId.get(id);
}

export function getByCategory(category: Category): AlgorithmModule[] {
  return ALGORITHMS.filter((a) => a.meta.category === category);
}

export function getCategoryMeta(id: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id)!;
}
