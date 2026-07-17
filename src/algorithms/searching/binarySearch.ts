import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { sortedArray, mulberry32 } from '@/utils/random';
import { FrameRecorder } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = sortedArray(size, seed);
  const target = array[Math.floor(mulberry32(seed + 3)() * array.length)];
  const rec = new FrameRecorder(array);
  rec.push(array, {}, `Binary search for ${target} in the sorted array.`);

  let lo = 0;
  let hi = array.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const highlights: Record<number, HighlightKind> = {};
    for (let k = lo; k <= hi; k++) highlights[k] = 'range';
    highlights[mid] = 'compare';
    rec.push(array, highlights, `Check middle arr[${mid}] = ${array[mid]} vs ${target}.`, [
      { label: 'lo', index: lo },
      { label: 'mid', index: mid },
      { label: 'hi', index: hi },
    ]);
    if (array[mid] === target) {
      rec.push(array, { [mid]: 'found' }, `Found ${target} at index ${mid}.`, [
        { label: 'mid', index: mid },
      ]);
      return rec.result;
    }
    if (array[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    typescript: `function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    java: `int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) >>> 1;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    cpp: `int binarySearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    csharp: `int BinarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
  },
  meta: {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    difficulty: 'Easy',
    summary: 'Repeatedly halves a sorted range by comparing the target to the midpoint.',
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      inPlace: true,
      recursive: false,
    },
    description:
      'Binary Search operates on a sorted array. It compares the target with the middle element and discards the half that cannot contain it, halving the search space each step. This logarithmic elimination makes it dramatically faster than linear search for large sorted data.',
    whenToUse:
      'Any lookup on sorted, randomly-accessible data — and the basis for many “search for a boundary” problems.',
    advantages: [
      'O(log n) — extremely fast on large inputs.',
      'Constant extra memory.',
      'Generalizes to lower/upper-bound and answer-search problems.',
    ],
    disadvantages: [
      'Requires the data to be sorted first.',
      'Needs random access (poor fit for linked lists).',
    ],
    applications: [
      'Dictionary/library lookups and database indexes.',
      'Finding boundaries in monotonic predicates (binary search on the answer).',
    ],
    steps: [
      'Set lo and hi to the array bounds.',
      'Compute mid and compare arr[mid] with the target.',
      'If equal, done; if smaller, search the right half; else the left half.',
      'Repeat until the range is empty.',
    ],
    pseudocode: `lo = 0; hi = n - 1
while lo <= hi
    mid = (lo + hi) / 2
    if arr[mid] == target: return mid
    if arr[mid] < target: lo = mid + 1
    else: hi = mid - 1
return -1`,
  },
};

export default module;
