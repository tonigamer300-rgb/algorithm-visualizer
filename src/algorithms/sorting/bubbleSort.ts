import type { AlgorithmModule, ArrayFrame } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  const n = array.length;
  rec.push(array, {}, 'Start: repeatedly compare adjacent pairs, bubbling the largest to the end.');

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      const sortedTail = Object.fromEntries(
        Array.from({ length: i }, (_, k) => [n - 1 - k, 'sorted' as const])
      );
      rec.push(array, { ...sortedTail, [j]: 'compare', [j + 1]: 'compare' }, `Compare ${array[j]} and ${array[j + 1]}.`);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        rec.push(array, { ...sortedTail, [j]: 'swap', [j + 1]: 'swap' }, `Swap because ${array[j + 1]} > ${array[j]}.`);
      }
    }
    if (!swapped) break;
  }
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    typescript: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int t = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = t;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    cpp: `void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    csharp: `void BubbleSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  },
  meta: {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'Easy',
    summary: 'Repeatedly swaps adjacent out-of-order elements until the list is sorted.',
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
      stable: true,
      inPlace: true,
      recursive: false,
    },
    description:
      'Bubble Sort steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Each full pass "bubbles" the next-largest value to its final position at the end of the array. An early-exit flag stops the algorithm as soon as a pass makes no swaps, giving it a best case of O(n) on already-sorted input.',
    whenToUse:
      'Almost never in production, but it is an excellent first algorithm for teaching comparisons, swaps and in-place sorting. Useful when simplicity matters more than speed and the input is tiny or nearly sorted.',
    advantages: [
      'Extremely simple to understand and implement.',
      'Stable — equal elements keep their relative order.',
      'In-place, using only O(1) extra memory.',
      'Detects an already-sorted array in a single pass.',
    ],
    disadvantages: [
      'O(n²) comparisons and swaps make it impractical for large inputs.',
      'Performs many more writes than selection or insertion sort.',
    ],
    applications: [
      'Teaching sorting fundamentals and algorithm analysis.',
      'Detecting whether a small list is already sorted.',
    ],
    steps: [
      'Compare the first two adjacent elements.',
      'Swap them if the left one is larger.',
      'Move one position right and repeat to the end of the unsorted region.',
      'The largest remaining element is now at the end — shrink the region.',
      'Repeat passes until a pass makes no swaps.',
    ],
    pseudocode: `for i = 0 to n - 2
    swapped = false
    for j = 0 to n - 2 - i
        if arr[j] > arr[j + 1]
            swap(arr[j], arr[j + 1])
            swapped = true
    if not swapped
        break`,
  },
};

export default module;
