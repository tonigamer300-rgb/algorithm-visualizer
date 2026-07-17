import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  const n = array.length;
  rec.push(array, {}, 'Select the smallest element from the unsorted region each pass.');

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    const sortedHead: Record<number, HighlightKind> = Object.fromEntries(
      Array.from({ length: i }, (_, k) => [k, 'sorted' as const])
    );
    for (let j = i + 1; j < n; j++) {
      rec.push(array, { ...sortedHead, [min]: 'min', [j]: 'compare' }, `Compare ${array[j]} with current min ${array[min]}.`);
      if (array[j] < array[min]) min = j;
    }
    if (min !== i) {
      [array[i], array[min]] = [array[min], array[i]];
      rec.push(array, { ...sortedHead, [i]: 'swap', [min]: 'swap' }, `Swap smallest (${array[i]}) into position ${i}.`);
    }
  }
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[min]) min = j;
    if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`,
    typescript: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++)
      if (arr[j] < arr[min]) min = j;
    if (min !== i) [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        m = i
        for j in range(i + 1, n):
            if arr[j] < arr[m]:
                m = j
        if m != i:
            arr[i], arr[m] = arr[m], arr[i]
    return arr`,
    java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[m]) m = j;
        int t = arr[i]; arr[i] = arr[m]; arr[m] = t;
    }
}`,
    cpp: `void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[m]) m = j;
        std::swap(arr[i], arr[m]);
    }
}`,
    csharp: `void SelectionSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[m]) m = j;
        (arr[i], arr[m]) = (arr[m], arr[i]);
    }
}`,
  },
  meta: {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    difficulty: 'Easy',
    summary: 'Repeatedly selects the minimum of the unsorted region and moves it to the front.',
    complexity: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: false,
      inPlace: true,
      recursive: false,
    },
    description:
      'Selection Sort divides the array into a sorted prefix and an unsorted suffix. On each pass it scans the unsorted suffix for the minimum element and swaps it into the boundary position. It always performs the same number of comparisons regardless of input, but makes at most n − 1 swaps — the fewest of the simple quadratic sorts.',
    whenToUse:
      'When the cost of writing/swapping is high and you want to minimize the number of writes, or for teaching selection-based sorting.',
    advantages: [
      'Simple and predictable — always O(n²) comparisons.',
      'Minimal number of swaps (at most n − 1).',
      'In-place with O(1) extra memory.',
    ],
    disadvantages: [
      'Not stable in its basic form.',
      'Quadratic time even on already-sorted input.',
    ],
    applications: [
      'Systems where memory writes are expensive (e.g. flash/EEPROM).',
      'Teaching the select-and-swap sorting pattern.',
    ],
    steps: [
      'Assume the first unsorted element is the minimum.',
      'Scan the rest of the unsorted region for a smaller value.',
      'Swap the true minimum into the boundary position.',
      'Grow the sorted prefix by one and repeat.',
    ],
    pseudocode: `for i = 0 to n - 2
    min = i
    for j = i + 1 to n - 1
        if arr[j] < arr[min]
            min = j
    swap(arr[i], arr[min])`,
  },
};

export default module;
