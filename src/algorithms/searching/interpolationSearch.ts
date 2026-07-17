import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { sortedArray, mulberry32 } from '@/utils/random';
import { FrameRecorder } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = sortedArray(size, seed);
  const target = array[Math.floor(mulberry32(seed + 9)() * array.length)];
  const rec = new FrameRecorder(array);
  rec.push(array, {}, `Estimate the target’s position by interpolating within [lo, hi].`);

  let lo = 0;
  let hi = array.length - 1;
  while (lo <= hi && target >= array[lo] && target <= array[hi]) {
    if (array[hi] === array[lo]) {
      if (array[lo] === target) {
        rec.push(array, { [lo]: 'found' }, `Found ${target} at index ${lo}.`);
        return rec.result;
      }
      break;
    }
    const pos =
      lo + Math.floor(((target - array[lo]) * (hi - lo)) / (array[hi] - array[lo]));
    const highlights: Record<number, HighlightKind> = {};
    for (let k = lo; k <= hi; k++) highlights[k] = 'range';
    highlights[pos] = 'compare';
    rec.push(array, highlights, `Probe arr[${pos}] = ${array[pos]} vs ${target}.`, [
      { label: 'lo', index: lo },
      { label: 'pos', index: pos },
      { label: 'hi', index: hi },
    ]);
    if (array[pos] === target) {
      rec.push(array, { [pos]: 'found' }, `Found ${target} at index ${pos}.`, [
        { label: 'pos', index: pos },
      ]);
      return rec.result;
    }
    if (array[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function interpolationSearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[hi] === arr[lo]) return arr[lo] === target ? lo : -1;
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
    typescript: `function interpolationSearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[hi] === arr[lo]) return arr[lo] === target ? lo : -1;
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
    python: `def interpolation_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi and arr[lo] <= target <= arr[hi]:
        if arr[hi] == arr[lo]:
            return lo if arr[lo] == target else -1
        pos = lo + (target - arr[lo]) * (hi - lo) // (arr[hi] - arr[lo])
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            lo = pos + 1
        else:
            hi = pos - 1
    return -1`,
    java: `int interpolationSearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        if (arr[hi] == arr[lo]) return arr[lo] == target ? lo : -1;
        int pos = lo + (int)(((long)(target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) lo = pos + 1; else hi = pos - 1;
    }
    return -1;
}`,
    cpp: `int interpolationSearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        if (arr[hi] == arr[lo]) return arr[lo] == target ? lo : -1;
        int pos = lo + (int)(((long)(target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) lo = pos + 1; else hi = pos - 1;
    }
    return -1;
}`,
    csharp: `int InterpolationSearch(int[] arr, int target) {
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        if (arr[hi] == arr[lo]) return arr[lo] == target ? lo : -1;
        int pos = lo + (int)(((long)(target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) lo = pos + 1; else hi = pos - 1;
    }
    return -1;
}`,
  },
  meta: {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'searching',
    difficulty: 'Medium',
    summary: 'Estimates the target’s position assuming uniformly distributed sorted keys.',
    complexity: {
      time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
      space: 'O(1)',
      inPlace: true,
      recursive: false,
    },
    description:
      'Interpolation Search improves on binary search when keys are uniformly distributed. Instead of always probing the middle, it estimates where the target likely sits by linear interpolation between the endpoints. On uniform data this reaches the target in about O(log log n) probes, but clustered data can degrade it to O(n).',
    whenToUse:
      'Large sorted arrays of uniformly (or near-uniformly) distributed numeric keys.',
    advantages: [
      'O(log log n) on uniformly distributed data — faster than binary search.',
      'Constant extra memory.',
    ],
    disadvantages: [
      'Degrades to O(n) on skewed/clustered distributions.',
      'Requires numeric keys and sorted, uniformly-distributed data.',
    ],
    applications: ['Searching large uniformly-distributed numeric datasets and phone-book style keys.'],
    steps: [
      'Estimate the probe position by interpolating the target between arr[lo] and arr[hi].',
      'Compare the probed value with the target.',
      'Narrow lo or hi based on the comparison and repeat.',
    ],
    pseudocode: `pos = lo + (target - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo])
if arr[pos] == target: return pos
if arr[pos] < target: lo = pos + 1 else hi = pos - 1`,
  },
};

export default module;
