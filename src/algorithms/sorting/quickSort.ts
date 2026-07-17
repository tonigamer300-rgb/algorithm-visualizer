import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  const sorted = new Set<number>();
  rec.push(array, {}, 'Partition around a pivot; recurse on each side (Lomuto scheme).');

  const marks = (extra: Record<number, HighlightKind>): Record<number, HighlightKind> => ({
    ...Object.fromEntries([...sorted].map((k) => [k, 'sorted' as const])),
    ...extra,
  });

  function quick(lo: number, hi: number): void {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.add(lo);
      return;
    }
    const pivot = array[hi];
    rec.push(array, marks({ [hi]: 'pivot' }), `Pivot = ${pivot} (index ${hi}).`);
    let i = lo;
    for (let j = lo; j < hi; j++) {
      rec.push(array, marks({ [hi]: 'pivot', [j]: 'compare', [i]: 'active' }), `Is ${array[j]} < pivot ${pivot}?`);
      if (array[j] < pivot) {
        [array[i], array[j]] = [array[j], array[i]];
        rec.push(array, marks({ [hi]: 'pivot', [i]: 'swap', [j]: 'swap' }), `Yes — move ${array[i]} left.`);
        i++;
      }
    }
    [array[i], array[hi]] = [array[hi], array[i]];
    sorted.add(i);
    rec.push(array, marks({ [i]: 'swap' }), `Place pivot at its final index ${i}.`);
    quick(lo, i - 1);
    quick(i + 1, hi);
  }

  quick(0, array.length - 1);
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  quickSort(arr, lo, i - 1);
  quickSort(arr, i + 1, hi);
  return arr;
}`,
    typescript: `function quickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {
  if (lo >= hi) return arr;
  const pivot = arr[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];
  quickSort(arr, lo, i - 1);
  quickSort(arr, i + 1, hi);
  return arr;
}`,
    python: `def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo >= hi:
        return arr
    pivot, i = arr[hi], lo
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[hi] = arr[hi], arr[i]
    quick_sort(arr, lo, i - 1)
    quick_sort(arr, i + 1, hi)
    return arr`,
    java: `void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
    int t = a[i]; a[i] = a[hi]; a[hi] = t;
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}`,
    cpp: `void quickSort(std::vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) std::swap(a[i++], a[j]);
    std::swap(a[i], a[hi]);
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}`,
    csharp: `void QuickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (a[j] < pivot) { (a[i], a[j]) = (a[j], a[i]); i++; }
    (a[i], a[hi]) = (a[hi], a[i]);
    QuickSort(a, lo, i - 1);
    QuickSort(a, i + 1, hi);
}`,
  },
  meta: {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    difficulty: 'Medium',
    summary: 'Partitions around a pivot and recursively sorts each side in place.',
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
      space: 'O(log n)',
      stable: false,
      inPlace: true,
      recursive: true,
    },
    description:
      'Quick Sort picks a pivot and partitions the array so that everything smaller comes before it and everything larger after, then recurses into each side. With good pivot choices it is the fastest general-purpose comparison sort in practice, though a poor pivot on already-sorted data degrades it to O(n²). Randomized or median-of-three pivots make the worst case unlikely.',
    whenToUse:
      'General-purpose in-memory sorting where average speed matters most and stability is not required.',
    advantages: [
      'Very fast in practice with excellent cache behavior.',
      'In-place — only O(log n) stack space.',
      'Tunable via pivot strategy and small-array cutoffs.',
    ],
    disadvantages: [
      'O(n²) worst case without randomized pivots.',
      'Not stable.',
      'Recursion depth can be large on adversarial input.',
    ],
    applications: [
      'Default sort in many standard libraries (often as introsort).',
      'Quickselect for finding order statistics.',
    ],
    steps: [
      'Choose a pivot (here, the last element).',
      'Partition: move elements smaller than the pivot to the left.',
      'Swap the pivot into the boundary — its final position.',
      'Recurse on the left and right partitions.',
    ],
    pseudocode: `quickSort(a, lo, hi)
    if lo >= hi: return
    p = partition(a, lo, hi)   // pivot's final index
    quickSort(a, lo, p - 1)
    quickSort(a, p + 1, hi)`,
  },
};

export default module;
