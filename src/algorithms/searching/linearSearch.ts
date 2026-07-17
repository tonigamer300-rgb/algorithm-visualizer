import type { AlgorithmModule, ArrayFrame } from '@/types';
import { randomArray, mulberry32 } from '@/utils/random';
import { FrameRecorder } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const target = array[Math.floor(mulberry32(seed + 7)() * array.length)];
  const rec = new FrameRecorder(array);
  rec.push(array, {}, `Scan left to right looking for ${target}.`);

  for (let i = 0; i < array.length; i++) {
    rec.push(array, { [i]: 'compare' }, `Is arr[${i}] = ${array[i]} equal to ${target}?`, [
      { label: 'i', index: i },
    ]);
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
    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === target) return i;
  return -1;
}`,
    typescript: `function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++)
    if (arr[i] === target) return i;
  return -1;
}`,
    python: `def linear_search(arr, target):
    for i, v in enumerate(arr):
        if v == target:
            return i
    return -1`,
    java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    cpp: `int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    csharp: `int LinearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.Length; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
  },
  meta: {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    difficulty: 'Easy',
    summary: 'Checks each element in turn until the target is found or the list ends.',
    complexity: {
      time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(1)',
      inPlace: true,
      recursive: false,
    },
    description:
      'Linear Search is the simplest search: it examines each element from the start until it finds the target or reaches the end. It makes no assumptions about ordering, so it works on any list, but it inspects up to n elements in the worst case.',
    whenToUse:
      'Unsorted or small collections, linked structures without random access, or one-off lookups where building an index is not worth it.',
    advantages: [
      'Works on unsorted data of any structure.',
      'No preprocessing or extra memory.',
      'Simple and cache-friendly for small arrays.',
    ],
    disadvantages: ['O(n) — slow on large collections.', 'Cannot exploit ordering to skip elements.'],
    applications: [
      'Searching short or unsorted lists.',
      'Fallback when data cannot be indexed or sorted.',
    ],
    steps: [
      'Start at the first element.',
      'Compare it with the target.',
      'If equal, return the index; otherwise move right.',
      'Return “not found” if the end is reached.',
    ],
    pseudocode: `for i = 0 to n - 1
    if arr[i] == target
        return i
return -1`,
  },
};

export default module;
