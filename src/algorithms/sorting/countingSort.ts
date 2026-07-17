import type { AlgorithmModule, ArrayFrame } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  rec.push(array, {}, 'Count occurrences of each value, then write them back in order.');

  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
    rec.push(array, { [i]: 'compare' }, `Count value ${array[i]}.`);
  }

  let idx = 0;
  const output = [...array];
  for (let v = 0; v <= max; v++) {
    while (count[v] > 0) {
      output[idx] = v;
      for (let k = 0; k < array.length; k++) array[k] = output[k];
      rec.push(array, { [idx]: 'swap' }, `Write ${v} into position ${idx}.`);
      idx++;
      count[v]--;
    }
  }
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  for (const v of arr) count[v]++;
  let idx = 0;
  for (let v = 0; v <= max; v++)
    while (count[v]-- > 0) arr[idx++] = v;
  return arr;
}`,
    typescript: `function countingSort(arr: number[]): number[] {
  const max = Math.max(...arr);
  const count = new Array<number>(max + 1).fill(0);
  for (const v of arr) count[v]++;
  let idx = 0;
  for (let v = 0; v <= max; v++)
    while (count[v]-- > 0) arr[idx++] = v;
  return arr;
}`,
    python: `def counting_sort(arr):
    m = max(arr)
    count = [0] * (m + 1)
    for v in arr:
        count[v] += 1
    idx = 0
    for v in range(m + 1):
        while count[v] > 0:
            arr[idx] = v
            idx += 1
            count[v] -= 1
    return arr`,
    java: `int[] countingSort(int[] a) {
    int max = Arrays.stream(a).max().getAsInt();
    int[] count = new int[max + 1];
    for (int v : a) count[v]++;
    int idx = 0;
    for (int v = 0; v <= max; v++)
        while (count[v]-- > 0) a[idx++] = v;
    return a;
}`,
    cpp: `void countingSort(std::vector<int>& a) {
    int max = *std::max_element(a.begin(), a.end());
    std::vector<int> count(max + 1, 0);
    for (int v : a) count[v]++;
    int idx = 0;
    for (int v = 0; v <= max; v++)
        while (count[v]-- > 0) a[idx++] = v;
}`,
    csharp: `void CountingSort(int[] a) {
    int max = a.Max();
    var count = new int[max + 1];
    foreach (int v in a) count[v]++;
    int idx = 0;
    for (int v = 0; v <= max; v++)
        while (count[v]-- > 0) a[idx++] = v;
}`,
  },
  meta: {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'sorting',
    difficulty: 'Medium',
    summary: 'Non-comparison sort that tallies value frequencies and rebuilds the array.',
    complexity: {
      time: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
      space: 'O(k)',
      stable: true,
      inPlace: false,
      recursive: false,
    },
    description:
      'Counting Sort works on integers in a known, bounded range k. It counts how many times each value appears, then uses those counts to place each value directly into its sorted position — no comparisons required. It runs in linear O(n + k) time, which beats comparison sorts when k is not much larger than n.',
    whenToUse:
      'Sorting integers (or keys mappable to integers) within a small, known range, or as the stable subroutine inside radix sort.',
    advantages: [
      'Linear O(n + k) time — faster than comparison sorts for small ranges.',
      'Stable when implemented with a prefix-sum placement.',
    ],
    disadvantages: [
      'Only works for integer keys in a bounded range.',
      'Memory grows with the value range k.',
    ],
    applications: [
      'Sorting exam scores, ages, or other small-range integers.',
      'Stable digit pass inside radix sort.',
    ],
    steps: [
      'Find the maximum value to size the count array.',
      'Tally the frequency of every value.',
      'Walk the counts in order, writing each value back that many times.',
    ],
    pseudocode: `count[v]++ for each v in arr
idx = 0
for v = 0 to max
    while count[v] > 0
        arr[idx++] = v
        count[v]--`,
  },
};

export default module;
