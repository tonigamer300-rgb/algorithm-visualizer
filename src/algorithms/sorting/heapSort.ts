import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  const n = array.length;
  const sorted = new Set<number>();
  rec.push(array, {}, 'Build a max-heap, then repeatedly extract the maximum.');

  const marks = (extra: Record<number, HighlightKind>): Record<number, HighlightKind> => ({
    ...Object.fromEntries([...sorted].map((k) => [k, 'sorted' as const])),
    ...extra,
  });

  function heapify(len: number, i: number): void {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < len) {
      rec.push(array, marks({ [i]: 'pivot', [l]: 'compare' }), `Compare parent ${array[i]} with left child ${array[l]}.`);
      if (array[l] > array[largest]) largest = l;
    }
    if (r < len) {
      rec.push(array, marks({ [i]: 'pivot', [r]: 'compare' }), `Compare with right child ${array[r]}.`);
      if (array[r] > array[largest]) largest = r;
    }
    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      rec.push(array, marks({ [i]: 'swap', [largest]: 'swap' }), `Swap ${array[largest]} down to restore heap.`);
      heapify(len, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  rec.push(array, {}, 'Max-heap built. Extract the root repeatedly.');

  for (let end = n - 1; end > 0; end--) {
    [array[0], array[end]] = [array[end], array[0]];
    sorted.add(end);
    rec.push(array, marks({ [0]: 'swap', [end]: 'sorted' }), `Move max ${array[end]} to sorted region.`);
    heapify(end, 0);
  }
  sorted.add(0);
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function heapSort(arr) {
  const n = arr.length;
  const heapify = (len, i) => {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && arr[l] > arr[largest]) largest = l;
    if (r < len && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(len, largest);
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) heapify(n, i);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    heapify(end, 0);
  }
  return arr;
}`,
    typescript: `function heapSort(arr: number[]): number[] {
  const n = arr.length;
  const heapify = (len: number, i: number): void => {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && arr[l] > arr[largest]) largest = l;
    if (r < len && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(len, largest);
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) heapify(n, i);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    heapify(end, 0);
  }
  return arr;
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    def heapify(length, i):
        largest, l, r = i, 2 * i + 1, 2 * i + 2
        if l < length and arr[l] > arr[largest]: largest = l
        if r < length and arr[r] > arr[largest]: largest = r
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(length, largest)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        heapify(end, 0)
    return arr`,
    java: `void heapify(int[] a, int len, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && a[l] > a[largest]) largest = l;
    if (r < len && a[r] > a[largest]) largest = r;
    if (largest != i) { int t = a[i]; a[i] = a[largest]; a[largest] = t; heapify(a, len, largest); }
}
void heapSort(int[] a) {
    int n = a.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int end = n - 1; end > 0; end--) {
        int t = a[0]; a[0] = a[end]; a[end] = t;
        heapify(a, end, 0);
    }
}`,
    cpp: `void heapify(std::vector<int>& a, int len, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && a[l] > a[largest]) largest = l;
    if (r < len && a[r] > a[largest]) largest = r;
    if (largest != i) { std::swap(a[i], a[largest]); heapify(a, len, largest); }
}
void heapSort(std::vector<int>& a) {
    int n = a.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int end = n - 1; end > 0; end--) { std::swap(a[0], a[end]); heapify(a, end, 0); }
}`,
    csharp: `void Heapify(int[] a, int len, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && a[l] > a[largest]) largest = l;
    if (r < len && a[r] > a[largest]) largest = r;
    if (largest != i) { (a[i], a[largest]) = (a[largest], a[i]); Heapify(a, len, largest); }
}
void HeapSort(int[] a) {
    int n = a.Length;
    for (int i = n / 2 - 1; i >= 0; i--) Heapify(a, n, i);
    for (int end = n - 1; end > 0; end--) { (a[0], a[end]) = (a[end], a[0]); Heapify(a, end, 0); }
}`,
  },
  meta: {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    difficulty: 'Medium',
    summary: 'Builds a max-heap, then repeatedly swaps the root to the end and re-heapifies.',
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(1)',
      stable: false,
      inPlace: true,
      recursive: false,
    },
    description:
      'Heap Sort treats the array as a binary heap. It first builds a max-heap in O(n), then repeatedly swaps the maximum (the root) with the last unsorted element and restores the heap property over the shrinking range. It combines the O(n log n) guarantee of merge sort with the O(1) memory of an in-place sort.',
    whenToUse:
      'When you need guaranteed O(n log n) time and O(1) memory, or a priority-queue-based selection.',
    advantages: [
      'Guaranteed O(n log n) in all cases.',
      'In-place — O(1) extra memory.',
      'No worst-case blowup like quicksort.',
    ],
    disadvantages: [
      'Not stable.',
      'Poor cache locality, so slower in practice than quicksort.',
    ],
    applications: [
      'Priority queues and scheduling.',
      'Systems needing worst-case time and memory guarantees.',
    ],
    steps: [
      'Build a max-heap from the array bottom-up.',
      'Swap the root (max) with the last element.',
      'Shrink the heap and sift the new root down.',
      'Repeat until the heap is empty.',
    ],
    pseudocode: `buildMaxHeap(a)
for end = n - 1 downto 1
    swap(a[0], a[end])
    heapify(a, end, 0)`,
  },
};

export default module;
