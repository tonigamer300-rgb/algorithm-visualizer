# Contributing to Algorithm Visualizer

Thanks for your interest in contributing! This guide walks you through the workflow and, most importantly, how to add a new algorithm.

## Ways to contribute

- **Add a new algorithm** (metadata + implementation).
- **Add an animated visualizer** for one of the documented-only algorithms.
- **Fix bugs** or improve accessibility, performance and design.
- **Improve docs** and code comments.

## Development setup

```bash
git clone https://github.com/tonigamer300-rgb/algorithm-visualizer.git
cd algorithm-visualizer
npm install
npm run dev
```

Before opening a pull request, make sure the following all pass:

```bash
npm run lint
npm run typecheck
npm run build
```

A Husky pre-commit hook runs `lint-staged` (ESLint + Prettier) on staged files automatically.

## Coding standards

- **TypeScript, strict mode.** Prefer explicit types on public functions and module contracts.
- **Reusable components and hooks.** Avoid duplication — share logic rather than copy it.
- **Comments only where they add value** (explain *why*, not *what*).
- **Follow the existing folder structure** and formatting (Prettier config included).

## Adding a new algorithm — step by step

Every algorithm is a self-contained module implementing the `AlgorithmModule` contract in `src/types`. You only touch three places.

### 1. Create the module

Create a file in the relevant category folder, e.g. `src/algorithms/sorting/shellSort.ts`:

```ts
import type { AlgorithmModule, ArrayFrame } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  // ...record a frame for every comparison and swap...
  rec.push(array, { 0: 'compare', 1: 'compare' }, 'Compare the first two elements.');
  // ...
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array', // 'array' | 'graph' | 'placeholder'
  generateFrames,
  code: {
    javascript: `function shellSort(arr) { /* ... */ }`,
    python: `def shell_sort(arr): ...`,
    // typescript, java, cpp, csharp are all optional but encouraged
  },
  meta: {
    id: 'shell-sort',
    name: 'Shell Sort',
    category: 'sorting',
    difficulty: 'Medium',
    summary: 'A gap-based generalization of insertion sort.',
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n^1.25)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: false,
      inPlace: true,
      recursive: false,
    },
    description: '...',
    whenToUse: '...',
    advantages: ['...'],
    disadvantages: ['...'],
    applications: ['...'],
    steps: ['...'],
    pseudocode: `...`,
  },
};

export default module;
```

**Frames** are the animation. Each frame is a snapshot of the data plus which indices are highlighted (`compare`, `swap`, `sorted`, `pivot`, `active`, `found`, `range`, `min`) and a short description. Record one frame per meaningful step so users can step through the algorithm.

If your algorithm is not array- or graph-shaped yet, set `visualizer: 'placeholder'` (or use the `definePlaceholder` factory in `_placeholder.ts`). The step controls will walk through your `steps`, and you can add a real visualizer later.

### 2. Implement the visualization

Reuse an existing visualizer via the `visualizer` field. To add a brand-new visual style, create a component in `src/visualizers/` and register it in `src/visualizers/index.ts` (it receives `{ frame, arraySize, seed }`).

### 3. Register it

Open `src/algorithms/registry.ts`, import your module, and add it to the `ALGORITHMS` array:

```ts
import shellSort from './sorting/shellSort';

export const ALGORITHMS: AlgorithmModule[] = [
  // ...
  shellSort,
];
```

That's the only wiring needed. The Algorithms grid, search, cards, visualization page, Learn tracker and random-algorithm button all pick it up automatically.

## Pull request checklist

- [ ] Lint, type-check and build pass locally.
- [ ] New algorithm registered in `registry.ts`.
- [ ] Metadata is complete and accurate (complexity, pros/cons, applications).
- [ ] Frames animate every comparison/swap where applicable.
- [ ] Screenshots or a short clip for UI changes.

Thank you for helping people learn algorithms! 💙
