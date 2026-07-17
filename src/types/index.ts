import type { ComponentType } from 'react';

/** Top-level algorithm groupings shown on the Algorithms page. */
export type Category =
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'trees'
  | 'recursion'
  | 'dp'
  | 'backtracking';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** Programming languages we ship reference implementations for. */
export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'csharp';

export interface Complexity {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
  stable?: boolean;
  inPlace?: boolean;
  recursive?: boolean;
}

/**
 * Fully self-describing metadata for a single algorithm. Everything the UI
 * needs to render cards, the complexity panel and the educational tabs comes
 * from this object, so adding an algorithm never requires touching a page.
 */
export interface AlgorithmMeta {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  summary: string;
  complexity: Complexity;
  /** Long-form description shown on the Explanation tab. */
  description: string;
  whenToUse: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
  /** Ordered, human-readable explanation of how the algorithm proceeds. */
  steps: string[];
  pseudocode: string;
}

/**
 * A single highlight state an array element can be in during a frame. The
 * ArrayVisualizer maps each of these to a distinct color.
 */
export type HighlightKind =
  | 'compare'
  | 'swap'
  | 'sorted'
  | 'pivot'
  | 'active'
  | 'found'
  | 'range'
  | 'min';

/** One rendered step for array-based algorithms (sorting & searching). */
export interface ArrayFrame {
  array: number[];
  highlights: Record<number, HighlightKind>;
  /** Optional labelled pointers (e.g. low / mid / high in binary search). */
  pointers?: { label: string; index: number }[];
  description: string;
}

/** One rendered step for graph traversal / pathfinding algorithms. */
export interface GraphFrame {
  visited: string[];
  frontier: string[];
  current: string | null;
  path: string[];
  description: string;
  /** Optional per-node distance/cost labels (Dijkstra, Bellman-Ford, A*). */
  distances?: Record<string, number | null>;
  /** Optional highlighted edges, e.g. MST edges for Prim/Kruskal. */
  markedEdges?: [string, string][];
}

/** Cell states shared by the grid/matrix visualizer (DP tables, boards, mazes). */
export type CellState =
  | 'active'
  | 'compare'
  | 'chosen'
  | 'best'
  | 'conflict'
  | 'path'
  | 'wall'
  | 'visited'
  | 'fixed'
  | 'start'
  | 'goal';

export interface GridCell {
  value: string | number;
  state?: CellState;
}

/** One rendered step for grid/matrix algorithms (DP, backtracking, Floyd-Warshall). */
export interface GridFrame {
  grid: GridCell[][];
  rowLabels?: string[];
  colLabels?: string[];
  /** Optional short caption above the grid (e.g. "dp[i][w]"). */
  caption?: string;
  /** Draw thicker separators every N columns/rows (e.g. Sudoku 3×3 boxes). */
  boxSize?: number;
  description: string;
}

export type TreeNodeState = 'active' | 'compare' | 'visited' | 'placed' | 'return' | 'path';

export interface TreeNodeView {
  id: string;
  label: string;
  x: number;
  y: number;
  state?: TreeNodeState;
  /** For red-black trees. */
  color?: 'red' | 'black';
}

/** One rendered step for tree structures and recursion call trees. */
export interface TreeFrame {
  nodes: TreeNodeView[];
  edges: { from: string; to: string }[];
  description: string;
}

/** One rendered step for the Towers of Hanoi. */
export interface HanoiFrame {
  /** Three pegs, each a stack of disk sizes from bottom to top. */
  pegs: number[][];
  moving: number | null;
  description: string;
}

/** Union of every frame shape a visualizer may consume. */
export type Frame = ArrayFrame | GraphFrame | GridFrame | TreeFrame | HanoiFrame;

/**
 * Props every visualizer component receives. `frame` is the currently selected
 * step; the visualizer is a pure function of the frame so stepping backwards
 * and forwards is trivial and deterministic.
 */
export interface VisualizerProps<F extends Frame = Frame> {
  frame: F;
  arraySize: number;
  /** Regenerate the underlying data set (wired to the "Generate" control). */
  seed: number;
}

/**
 * Which shared visualizer renders this algorithm's frames. Visualizers are
 * shared per data-shape (rather than per algorithm) to avoid duplication, and
 * are lazy-loaded so only the one in use ships to the browser.
 */
export type VisualizerKind = 'array' | 'graph' | 'grid' | 'tree' | 'hanoi' | 'placeholder';

/** Contract implemented by every algorithm module so it can be registered. */
export interface AlgorithmModule {
  meta: AlgorithmMeta;
  code: Partial<Record<Language, string>>;
  /** The shared visualizer used to render this algorithm. */
  visualizer: VisualizerKind;
  /**
   * Build the full list of frames from a data set of the given size + seed.
   * Omitted for algorithms that are registered (metadata only) but not yet
   * animated — those fall back to the educational placeholder visualizer.
   */
  generateFrames?: (size: number, seed: number) => Frame[];
}

/** A component that can render any of the shared visualizers. */
export type VisualizerComponent = ComponentType<VisualizerProps>;

export interface CategoryMeta {
  id: Category;
  label: string;
  description: string;
}
