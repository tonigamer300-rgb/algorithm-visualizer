import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { sortedArray, mulberry32 } from '@/utils/random';
import { FrameRecorder } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = sortedArray(size, seed);
  const target = array[Math.floor(mulberry32(seed + 5)() * array.length)];
  const rec = new FrameRecorder(array);
  const n = array.length;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  rec.push(array, {}, `Jump in blocks of ${step}, then linear-scan the found block.`);

  let prev = 0;
  let curr = step;
  while (curr < n && array[Math.min(curr, n) - 1] < target) {
    const idx = Math.min(curr, n) - 1;
    rec.push(array, { [idx]: 'compare' }, `Block end arr[${idx}] = ${array[idx]} < ${target}, jump.`, [
      { label: 'blk', index: idx },
    ]);
    prev = curr;
    curr += step;
  }

  for (let i = prev; i < Math.min(curr, n); i++) {
    const hl: Record<number, HighlightKind> = { [i]: 'compare' };
    rec.push(array, hl, `Linear scan arr[${i}] = ${array[i]}.`, [{ label: 'i', index: i }]);
    if (array[i] === target) {
      rec.push(array, { [i]: 'found' }, `Found ${target} at index ${i}.`, [{ label: 'i', index: i }]);
      return rec.result;
    }
  }
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0, curr = step;
  while (curr < n && arr[Math.min(curr, n) - 1] < target) {
    prev = curr;
    curr += step;
  }
  for (let i = prev; i < Math.min(curr, n); i++)
    if (arr[i] === target) return i;
  return -1;
}`,
    typescript: `function jumpSearch(arr: number[], target: number): number {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0, curr = step;
  while (curr < n && arr[Math.min(curr, n) - 1] < target) {
    prev = curr;
    curr += step;
  }
  for (let i = prev; i < Math.min(curr, n); i++)
    if (arr[i] === target) return i;
  return -1;
}`,
    python: `import math
def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev, curr = 0, step
    while curr < n and arr[min(curr, n) - 1] < target:
        prev = curr
        curr += step
    for i in range(prev, min(curr, n)):
        if arr[i] == target:
            return i
    return -1`,
    java: `int jumpSearch(int[] arr, int target) {
    int n = arr.length, step = (int) Math.sqrt(n), prev = 0, curr = step;
    while (curr < n && arr[Math.min(curr, n) - 1] < target) { prev = curr; curr += step; }
    for (int i = prev; i < Math.min(curr, n); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    cpp: `int jumpSearch(const std::vector<int>& arr, int target) {
    int n = arr.size(), step = (int) std::sqrt(n), prev = 0, curr = step;
    while (curr < n && arr[std::min(curr, n) - 1] < target) { prev = curr; curr += step; }
    for (int i = prev; i < std::min(curr, n); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    csharp: `int JumpSearch(int[] arr, int target) {
    int n = arr.Length, step = (int) Math.Sqrt(n), prev = 0, curr = step;
    while (curr < n && arr[Math.Min(curr, n) - 1] < target) { prev = curr; curr += step; }
    for (int i = prev; i < Math.Min(curr, n); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
  },
  meta: {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'searching',
    difficulty: 'Easy',
    summary: 'Jumps ahead in fixed blocks on sorted data, then linear-scans one block.',
    complexity: {
      time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
      space: 'O(1)',
      inPlace: true,
      recursive: false,
    },
    description:
      'Jump Search works on sorted arrays by skipping ahead in blocks of size √n until it passes the target, then performing a linear scan within the last block. Its √n step size is the value that minimizes the combined jumping and scanning cost, sitting between linear and binary search.',
    whenToUse:
      'Sorted data where jumping backward is costly (e.g. certain storage systems) so binary search’s random jumps are undesirable.',
    advantages: [
      'Faster than linear search — O(√n).',
      'Only ever steps forward then scans one block back.',
    ],
    disadvantages: ['Requires sorted data.', 'Slower than binary search’s O(log n).'],
    applications: ['Searching sorted data on media where backward seeks are expensive.'],
    steps: [
      'Compute block size √n.',
      'Jump forward block by block until a block end ≥ target.',
      'Linear-scan the current block for the target.',
    ],
    pseudocode: `step = floor(sqrt(n))
while arr[min(curr, n) - 1] < target: curr += step
linear scan arr[prev .. curr) for target`,
  },
};

export default module;
