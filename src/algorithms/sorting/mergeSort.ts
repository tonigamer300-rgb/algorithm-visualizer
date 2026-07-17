import type { AlgorithmModule, ArrayFrame, HighlightKind } from '@/types';
import { randomArray } from '@/utils/random';
import { FrameRecorder, allSorted } from '../_shared';

function generateFrames(size: number, seed: number): ArrayFrame[] {
  const array = randomArray(size, seed);
  const rec = new FrameRecorder(array);
  rec.push(array, {}, 'Divide the array in half recursively, then merge sorted halves.');

  const range = (lo: number, hi: number): Record<number, HighlightKind> =>
    Object.fromEntries(Array.from({ length: hi - lo + 1 }, (_, k) => [lo + k, 'range' as const]));

  function mergeSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    rec.push(array, range(lo, hi), `Split [${lo}..${hi}] at ${mid}.`);
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);

    const merged: number[] = [];
    let i = lo;
    let j = mid + 1;
    while (i <= mid && j <= hi) {
      rec.push(array, { ...range(lo, hi), [i]: 'compare', [j]: 'compare' }, `Compare ${array[i]} and ${array[j]}.`);
      merged.push(array[i] <= array[j] ? array[i++] : array[j++]);
    }
    while (i <= mid) merged.push(array[i++]);
    while (j <= hi) merged.push(array[j++]);
    for (let k = 0; k < merged.length; k++) array[lo + k] = merged[k];
    rec.push(array, range(lo, hi), `Merged sorted run [${lo}..${hi}].`);
  }

  mergeSort(0, array.length - 1);
  rec.push(array, allSorted(array), 'Array fully sorted.');
  return rec.result;
}

const module: AlgorithmModule = {
  visualizer: 'array',
  generateFrames,
  code: {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}`,
    typescript: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]`,
    java: `int[] mergeSort(int[] a) {
    if (a.length <= 1) return a;
    int mid = a.length / 2;
    int[] l = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] r = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    int[] out = new int[a.length];
    int i = 0, j = 0, k = 0;
    while (i < l.length && j < r.length)
        out[k++] = l[i] <= r[j] ? l[i++] : r[j++];
    while (i < l.length) out[k++] = l[i++];
    while (j < r.length) out[k++] = r[j++];
    return out;
}`,
    cpp: `std::vector<int> mergeSort(std::vector<int> a) {
    if (a.size() <= 1) return a;
    size_t mid = a.size() / 2;
    auto l = mergeSort({a.begin(), a.begin() + mid});
    auto r = mergeSort({a.begin() + mid, a.end()});
    std::vector<int> out;
    size_t i = 0, j = 0;
    while (i < l.size() && j < r.size())
        out.push_back(l[i] <= r[j] ? l[i++] : r[j++]);
    while (i < l.size()) out.push_back(l[i++]);
    while (j < r.size()) out.push_back(r[j++]);
    return out;
}`,
    csharp: `int[] MergeSort(int[] a) {
    if (a.Length <= 1) return a;
    int mid = a.Length / 2;
    var l = MergeSort(a[..mid]);
    var r = MergeSort(a[mid..]);
    var outArr = new int[a.Length];
    int i = 0, j = 0, k = 0;
    while (i < l.Length && j < r.Length)
        outArr[k++] = l[i] <= r[j] ? l[i++] : r[j++];
    while (i < l.Length) outArr[k++] = l[i++];
    while (j < r.Length) outArr[k++] = r[j++];
    return outArr;
}`,
  },
  meta: {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    difficulty: 'Medium',
    summary: 'Divide-and-conquer sort that recursively splits, sorts, and merges halves.',
    complexity: {
      time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
      stable: true,
      inPlace: false,
      recursive: true,
    },
    description:
      'Merge Sort recursively divides the array into halves until each piece has one element, then merges those pieces back together in sorted order. Because merging two sorted runs is linear and the recursion is log-depth, it guarantees O(n log n) time in every case. It is stable, making it the classic choice for sorting objects by multiple keys.',
    whenToUse:
      'When guaranteed O(n log n) performance and stability matter — sorting linked lists, external/on-disk sorting, or multi-key sorts.',
    advantages: [
      'Guaranteed O(n log n) in the worst case.',
      'Stable — preserves the order of equal keys.',
      'Parallelizes well and suits external sorting.',
    ],
    disadvantages: [
      'Needs O(n) auxiliary memory for the classic array version.',
      'Slower in practice than quicksort on small in-memory arrays.',
    ],
    applications: [
      'External sorting of data that does not fit in memory.',
      'Stable sorting in language standard libraries (e.g. Timsort).',
      'Sorting linked lists efficiently.',
    ],
    steps: [
      'Split the array into two halves.',
      'Recursively sort each half.',
      'Merge the two sorted halves by repeatedly taking the smaller front element.',
      'Copy the merged run back into place.',
    ],
    pseudocode: `mergeSort(a, lo, hi)
    if lo >= hi: return
    mid = (lo + hi) / 2
    mergeSort(a, lo, mid)
    mergeSort(a, mid + 1, hi)
    merge(a, lo, mid, hi)`,
  },
};

export default module;
