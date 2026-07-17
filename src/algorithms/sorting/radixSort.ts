import type { AlgorithmModule, ArrayFrame } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  rec.push(array, {}, 'Sort by each digit from least to most significant (stable counting per digit).');

  const max = Math.max(...array);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(array.length).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < array.length; i++) count[Math.floor(array[i] / exp) % 10]++;
    for (let d = 1; d < 10; d++) count[d] += count[d - 1];
    for (let i = array.length - 1; i >= 0; i--) {
      const digit = Math.floor(array[i] / exp) % 10;
      output[--count[digit]] = array[i];
    }
    for (let i = 0; i < array.length; i++) array[i] = output[i];
    rec.push(
      array,
      Object.fromEntries(array.map((_, i) => [i, 'range' as const])),
      `Stable pass on the ${exp === 1 ? 'ones' : exp === 10 ? 'tens' : `10^${String(exp).length - 1}`} digit.`
    );
  }
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);
    for (const v of arr) count[Math.floor(v / exp) % 10]++;
    for (let d = 1; d < 10; d++) count[d] += count[d - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[--count[digit]] = arr[i];
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  }
  return arr;
}`,
    typescript: `function radixSort(arr: number[]): number[] {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array<number>(arr.length);
    const count = new Array<number>(10).fill(0);
    for (const v of arr) count[Math.floor(v / exp) % 10]++;
    for (let d = 1; d < 10; d++) count[d] += count[d - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[--count[digit]] = arr[i];
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  }
  return arr;
}`,
    python: `def radix_sort(arr):
    m = max(arr)
    exp = 1
    while m // exp > 0:
        output = [0] * len(arr)
        count = [0] * 10
        for v in arr:
            count[(v // exp) % 10] += 1
        for d in range(1, 10):
            count[d] += count[d - 1]
        for i in range(len(arr) - 1, -1, -1):
            digit = (arr[i] // exp) % 10
            count[digit] -= 1
            output[count[digit]] = arr[i]
        arr[:] = output
        exp *= 10
    return arr`,
    java: `int[] radixSort(int[] a) {
    int max = Arrays.stream(a).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int[] output = new int[a.length];
        int[] count = new int[10];
        for (int v : a) count[(v / exp) % 10]++;
        for (int d = 1; d < 10; d++) count[d] += count[d - 1];
        for (int i = a.length - 1; i >= 0; i--)
            output[--count[(a[i] / exp) % 10]] = a[i];
        System.arraycopy(output, 0, a, 0, a.length);
    }
    return a;
}`,
    cpp: `void radixSort(std::vector<int>& a) {
    int max = *std::max_element(a.begin(), a.end());
    for (int exp = 1; max / exp > 0; exp *= 10) {
        std::vector<int> output(a.size());
        int count[10] = {0};
        for (int v : a) count[(v / exp) % 10]++;
        for (int d = 1; d < 10; d++) count[d] += count[d - 1];
        for (int i = a.size() - 1; i >= 0; i--)
            output[--count[(a[i] / exp) % 10]] = a[i];
        a = output;
    }
}`,
    csharp: `void RadixSort(int[] a) {
    int max = a.Max();
    for (int exp = 1; max / exp > 0; exp *= 10) {
        var output = new int[a.Length];
        var count = new int[10];
        foreach (int v in a) count[(v / exp) % 10]++;
        for (int d = 1; d < 10; d++) count[d] += count[d - 1];
        for (int i = a.Length - 1; i >= 0; i--)
            output[--count[(a[i] / exp) % 10]] = a[i];
        Array.Copy(output, a, a.Length);
    }
}`,
  },
  meta: {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'sorting',
    difficulty: 'Medium',
    summary: 'Sorts integers digit by digit using a stable counting pass for each digit.',
    complexity: {
      time: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
      space: 'O(n + k)',
      stable: true,
      inPlace: false,
      recursive: false,
    },
    description:
      'Radix Sort sorts numbers by processing their digits one place value at a time, from least significant to most significant, using a stable counting sort for each digit. Because each pass is stable, once the most significant digit is processed the whole array is sorted. For fixed-width integers this yields effectively linear time.',
    whenToUse:
      'Large volumes of fixed-width integers or strings where k (number of digits) is small relative to n.',
    advantages: [
      'Linear O(nk) time for fixed-width keys.',
      'Stable.',
      'No key comparisons required.',
    ],
    disadvantages: [
      'Limited to integer/string keys with a defined digit structure.',
      'Uses extra O(n + k) memory per pass.',
    ],
    applications: [
      'Sorting large integer or fixed-length string keys.',
      'Suffix-array construction and some database indexes.',
    ],
    steps: [
      'Find the maximum value to know the digit count.',
      'For each digit position (ones, tens, …):',
      'Stably distribute elements into buckets by that digit.',
      'Concatenate buckets back into the array and move to the next digit.',
    ],
    pseudocode: `for exp = 1; max / exp > 0; exp *= 10
    countingSortByDigit(arr, exp)`,
  },
};

export default module;
