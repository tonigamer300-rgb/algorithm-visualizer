import type { AlgorithmModule, HanoiFrame, TreeFrame, TreeNodeState } from '@/types';
import { TNode, node, frame } from '../trees/_tree';

// ---------------------------------------------------------------------------
// Factorial — recursion as a call chain
// ---------------------------------------------------------------------------
function factorialFrames(): TreeFrame[] {
  const N = 5;
  const frames: TreeFrame[] = [];
  const ids: string[] = [];

  // Build the call chain factorial(N) -> factorial(N-1) -> ... -> factorial(1).
  let root: TNode | null = null;
  let tail: TNode | null = null;
  for (let k = N; k >= 1; k--) {
    const n = node(`f${k}`, `${k}!`);
    ids.push(n.id);
    if (!root) root = n;
    if (tail) tail.left = n;
    tail = n;
  }

  const returned: Record<string, TreeNodeState> = {};
  // Descend (calls).
  for (let k = N; k >= 1; k--) {
    frames.push(frame(root, { ...returned, [`f${k}`]: 'active' }, `Call factorial(${k}) = ${k} × factorial(${k - 1}).`));
  }
  // Ascend (returns), computing values.
  let acc = 1;
  for (let k = 1; k <= N; k++) {
    acc *= k;
    returned[`f${k}`] = 'return';
    frames.push(frame(root, { ...returned, [`f${k}`]: 'active' }, `factorial(${k}) returns ${acc}.`));
  }
  frames.push(frame(root, returned, `Done: factorial(${N}) = ${acc}.`));
  return frames;
}

// ---------------------------------------------------------------------------
// Fibonacci — the exponential recursion tree
// ---------------------------------------------------------------------------
function fibonacciFrames(): TreeFrame[] {
  const N = 5;
  const frames: TreeFrame[] = [];
  const kOf: Record<string, number> = {};
  let counter = 0;

  const build = (k: number): TNode => {
    const id = `n${counter++}`;
    const n = node(id, `fib(${k})`);
    kOf[id] = k;
    if (k >= 2) {
      n.left = build(k - 1);
      n.right = build(k - 2);
    }
    return n;
  };
  const root = build(N);

  const returned: Record<string, TreeNodeState> = {};
  const walk = (n: TNode): number => {
    frames.push(frame(root, { ...returned, [n.id]: 'active' }, `Call ${n.label}.`));
    const k = kOf[n.id];
    let value: number;
    if (k < 2) {
      value = k;
    } else {
      value = walk(n.left!) + walk(n.right!);
    }
    returned[n.id] = 'return';
    frames.push(frame(root, { ...returned, [n.id]: 'active' }, `${n.label} = ${value}.`));
    return value;
  };
  walk(root);
  frames.push(frame(root, returned, `Notice how many calls repeat — memoization collapses this tree to O(n).`));
  return frames;
}

// ---------------------------------------------------------------------------
// Towers of Hanoi — disks moving across pegs
// ---------------------------------------------------------------------------
function hanoiFrames(): HanoiFrame[] {
  const N = 4;
  const pegs: number[][] = [Array.from({ length: N }, (_, i) => N - i), [], []];
  const names = ['A', 'B', 'C'];
  const frames: HanoiFrame[] = [
    { pegs: pegs.map((p) => [...p]), moving: null, description: `Move all ${N} disks from A to C, one at a time.` },
  ];

  const move = (from: number, to: number) => {
    const disk = pegs[from].pop()!;
    pegs[to].push(disk);
    frames.push({
      pegs: pegs.map((p) => [...p]),
      moving: disk,
      description: `Move disk ${disk}: ${names[from]} → ${names[to]}.`,
    });
  };
  const solve = (k: number, from: number, to: number, aux: number) => {
    if (k === 0) return;
    solve(k - 1, from, aux, to);
    move(from, to);
    solve(k - 1, aux, to, from);
  };
  solve(N, 0, 2, 1);
  frames.push({ pegs: pegs.map((p) => [...p]), moving: null, description: `Solved in ${frames.length - 1} moves (2^${N} − 1).` });
  return frames;
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
const factorial: AlgorithmModule = {
  visualizer: 'tree',
  generateFrames: factorialFrames,
  code: {
    javascript: `function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}`,
    python: `def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)`,
  },
  meta: {
    id: 'factorial',
    name: 'Factorial',
    category: 'recursion',
    difficulty: 'Easy',
    summary: 'Classic recursion: n! = n × (n − 1)! with base case 0! = 1.',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(n)', recursive: true },
    description:
      'The factorial of n multiplies all integers from 1 to n. Its recursive definition — n! = n × (n − 1)! with 0! = 1 — makes it the canonical first example of recursion, base cases and the call stack.',
    whenToUse: 'Teaching recursion and combinatorics (permutations, binomial coefficients).',
    advantages: ['Simple, self-evidently correct recursion.', 'Directly mirrors the mathematical definition.'],
    disadvantages: ['Recursive stack depth O(n).', 'Overflows fast — use big integers beyond 20!.'],
    applications: ['Combinatorics and probability.', 'Teaching recursion and induction.'],
    steps: ['If n is 0, return 1 (base case).', 'Otherwise return n × factorial(n − 1).', 'Unwind the stack, multiplying on the way back.'],
    pseudocode: `factorial(n)
    if n == 0: return 1
    return n * factorial(n - 1)`,
  },
};

const fibonacci: AlgorithmModule = {
  visualizer: 'tree',
  generateFrames: fibonacciFrames,
  code: {
    javascript: `function fib(n, memo = {}) {
  if (n < 2) return n;
  if (memo[n]) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}`,
    python: `from functools import lru_cache
@lru_cache(None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)`,
  },
  meta: {
    id: 'fibonacci',
    name: 'Fibonacci',
    category: 'recursion',
    difficulty: 'Easy',
    summary: 'Each number is the sum of the previous two — naive vs. memoized recursion.',
    complexity: { time: { best: 'O(n)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' }, space: 'O(n)', recursive: true },
    description:
      'The Fibonacci sequence defines each term as the sum of the two before it. The naive recursion recomputes the same subproblems exponentially, which makes it a perfect motivation for memoization and dynamic programming — dropping the cost from O(2ⁿ) to O(n).',
    whenToUse: 'Teaching overlapping subproblems, memoization, and the leap to dynamic programming.',
    advantages: ['Vivid demonstration of exponential blow-up.', 'Shows the power of memoization.'],
    disadvantages: ['Naive version is exponential.', 'Deep recursion without memoization.'],
    applications: ['Teaching DP.', 'Modeling growth and appears across nature and algorithms.'],
    steps: ['Base cases: fib(0) = 0, fib(1) = 1.', 'Otherwise return fib(n − 1) + fib(n − 2).', 'Cache results to avoid recomputation (memoization).'],
    pseudocode: `fib(n)
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)`,
  },
};

const hanoi: AlgorithmModule = {
  visualizer: 'hanoi',
  generateFrames: hanoiFrames,
  code: {
    javascript: `function hanoi(n, from, to, aux, moves = []) {
  if (n === 0) return moves;
  hanoi(n - 1, from, aux, to, moves);
  moves.push([from, to]);
  hanoi(n - 1, aux, to, from, moves);
  return moves;
}`,
    python: `def hanoi(n, src, dst, aux, moves=None):
    if moves is None:
        moves = []
    if n == 0:
        return moves
    hanoi(n - 1, src, aux, dst, moves)
    moves.append((src, dst))
    hanoi(n - 1, aux, dst, src, moves)
    return moves`,
  },
  meta: {
    id: 'towers-of-hanoi',
    name: 'Towers of Hanoi',
    category: 'recursion',
    difficulty: 'Medium',
    summary: 'Move a stack of disks between pegs, never placing a larger disk on a smaller.',
    complexity: { time: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' }, space: 'O(n)', recursive: true },
    description:
      'Towers of Hanoi asks you to move n disks from a source peg to a target peg using one auxiliary peg, moving one disk at a time and never stacking a larger disk on a smaller one. The elegant recursive solution moves n − 1 disks aside, moves the largest, then moves the rest back — requiring exactly 2ⁿ − 1 moves.',
    whenToUse: 'Teaching recursion, problem decomposition, and exponential lower bounds.',
    advantages: ['Beautifully simple recursive structure.', 'Provably optimal at 2ⁿ − 1 moves.'],
    disadvantages: ['Exponential number of moves.', 'Impractical for large n.'],
    applications: ['Teaching recursion.', 'Backup rotation schemes.'],
    steps: ['Move n − 1 disks from source to auxiliary.', 'Move the largest disk from source to target.', 'Move the n − 1 disks from auxiliary to target.'],
    pseudocode: `hanoi(n, from, to, aux)
    if n == 0: return
    hanoi(n - 1, from, aux, to)
    move disk from -> to
    hanoi(n - 1, aux, to, from)`,
  },
};

const modules: AlgorithmModule[] = [factorial, fibonacci, hanoi];
export default modules;
