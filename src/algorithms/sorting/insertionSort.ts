import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  const n = array.length;
  rec.push(array, {}, 'Grow a sorted prefix by inserting each element into place.');

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    const sortedHead: Record<number, HighlightKind> = Object.fromEntries(
      Array.from({ length: i }, (_, k) => [k, 'sorted' as const])
    );
    rec.push(array, { ...sortedHead, [i]: 'active' }, `Take ${key} and find its slot in the sorted prefix.`);
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      rec.push(array, { ...sortedHead, [j]: 'compare', [j + 1]: 'swap' }, `Shift ${array[j]} right.`);
      j--;
    }
    array[j + 1] = key;
    rec.push(array, { ...sortedHead, [j + 1]: 'swap' }, `Insert ${key} at position ${j + 1}.`);
  }
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    typescript: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    cpp: `void insertionSort(std::vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    csharp: `void InsertionSort(int[] arr) {
    for (int i = 1; i < arr.Length; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
  meta: {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    difficulty: 'Easy',
    summary: 'Builds a sorted prefix by inserting each new element into its correct position.',
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: true,
      inPlace: true,
      recursive: false,
    },
    description:
      'Insertion Sort builds the final sorted array one element at a time. It takes the next element and shifts every larger element in the sorted prefix one position to the right, then drops the element into the gap. It is very efficient for small or nearly-sorted inputs, running in linear time when the array is already ordered.',
    whenToUse:
      'Small data sets, nearly-sorted data, or as the base case inside faster divide-and-conquer sorts (e.g. Timsort, introsort).',
    advantages: [
      'Adaptive: O(n) on nearly-sorted data.',
      'Stable and in-place.',
      'Low overhead and simple — great for small arrays.',
      'Online: can sort a list as it receives it.',
    ],
    disadvantages: ['O(n²) on average and worst case.', 'Many shifts when data is in reverse order.'],
    applications: [
      'Base case for hybrid sorts on small partitions.',
      'Sorting small or streaming/near-sorted data.',
    ],
    steps: [
      'Treat the first element as a sorted prefix.',
      'Take the next element as the key.',
      'Shift larger elements in the prefix one step right.',
      'Insert the key into the opened gap.',
      'Repeat until the whole array is consumed.',
    ],
    pseudocode: `for i = 1 to n - 1
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key
        arr[j + 1] = arr[j]
        j = j - 1
    arr[j + 1] = key`,
  },
};

export default module;
