import type { AlgorithmModule } from '@/types';
import { definePlaceholder } from '../_placeholder';

const factorial = definePlaceholder(
  {
    id: 'factorial',
    name: 'Factorial',
    category: 'recursion',
    difficulty: 'Easy',
    summary: 'Classic recursion: n! = n × (n − 1)! with base case 0! = 1.',
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
      recursive: true,
    },
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
  {
    javascript: `function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}`,
    python: `def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)`,
  }
);

const fibonacci = definePlaceholder(
  {
    id: 'fibonacci',
    name: 'Fibonacci',
    category: 'recursion',
    difficulty: 'Easy',
    summary: 'Each number is the sum of the previous two — naive vs. memoized recursion.',
    complexity: {
      time: { best: 'O(n)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' },
      space: 'O(n)',
      recursive: true,
    },
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
  {
    javascript: `function fib(n, memo = {}) {
  if (n < 2) return n;
  if (memo[n]) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}`,
    python: `from functools import lru_cache
@lru_cache(None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)`,
  }
);

const hanoi = definePlaceholder(
  {
    id: 'towers-of-hanoi',
    name: 'Towers of Hanoi',
    category: 'recursion',
    difficulty: 'Medium',
    summary: 'Move a stack of disks between pegs, never placing a larger disk on a smaller.',
    complexity: {
      time: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' },
      space: 'O(n)',
      recursive: true,
    },
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
  {
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
  }
);

const modules: AlgorithmModule[] = [factorial, fibonacci, hanoi];
export default modules;
