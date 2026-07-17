import type { AlgorithmModule, CellState, GridCell, GridFrame } from '@/types';

// ---------------------------------------------------------------------------
// 0/1 Knapsack — fill the dp[i][w] table
// ---------------------------------------------------------------------------
function knapsackFrames(): GridFrame[] {
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 6];
  const W = 7;
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const rowLabels = ['∅', ...weights.map((w, i) => `w${w} v${values[i]}`)];
  const colLabels = Array.from({ length: W + 1 }, (_, w) => String(w));
  const frames: GridFrame[] = [];

  const snap = (states: Record<string, CellState>, desc: string) =>
    frames.push({
      grid: dp.map((row, i) =>
        row.map((v, w): GridCell => ({ value: v, state: states[`${i},${w}`] }))
      ),
      rowLabels,
      colLabels,
      caption: 'dp[item][capacity] = best value',
      description: desc,
    });

  snap({}, 'Row 0 / column 0 are all zero: no items or no capacity means value 0.');
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      const states: Record<string, CellState> = { [`${i},${w}`]: 'active', [`${i - 1},${w}`]: 'compare' };
      let take = 0;
      if (weights[i - 1] <= w) {
        states[`${i - 1},${w - weights[i - 1]}`] = 'compare';
        take = values[i - 1] + dp[i - 1][w - weights[i - 1]];
      }
      dp[i][w] = Math.max(dp[i - 1][w], take);
      snap(states, `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}), cap ${w}: best = ${dp[i][w]}.`);
    }
  }
  const done: Record<string, CellState> = { [`${n},${W}`]: 'chosen' };
  snap(done, `Maximum value with capacity ${W} is ${dp[n][W]} (bottom-right cell).`);
  return frames;
}

// ---------------------------------------------------------------------------
// Longest Common Subsequence — fill dp[i][j]
// ---------------------------------------------------------------------------
function lcsFrames(): GridFrame[] {
  const a = 'AGCAT';
  const b = 'GAC';
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const rowLabels = ['∅', ...a.split('')];
  const colLabels = ['∅', ...b.split('')];
  const frames: GridFrame[] = [];

  const snap = (states: Record<string, CellState>, desc: string) =>
    frames.push({
      grid: dp.map((row, i) => row.map((v, j): GridCell => ({ value: v, state: states[`${i},${j}`] }))),
      rowLabels,
      colLabels,
      caption: `LCS of "${a}" and "${b}"`,
      description: desc,
    });

  snap({}, 'Empty prefixes give an LCS length of 0 (first row and column).');
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = a[i - 1] === b[j - 1];
      const states: Record<string, CellState> = { [`${i},${j}`]: 'active' };
      if (match) {
        states[`${i - 1},${j - 1}`] = 'compare';
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        states[`${i - 1},${j}`] = 'compare';
        states[`${i},${j - 1}`] = 'compare';
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      snap(
        states,
        match
          ? `'${a[i - 1]}' = '${b[j - 1]}': extend the diagonal → ${dp[i][j]}.`
          : `'${a[i - 1]}' ≠ '${b[j - 1]}': take max of left/top → ${dp[i][j]}.`
      );
    }
  }
  snap({ [`${m},${n}`]: 'chosen' }, `Longest common subsequence has length ${dp[m][n]}.`);
  return frames;
}

// ---------------------------------------------------------------------------
// Coin Change — 1-D dp over amounts
// ---------------------------------------------------------------------------
function coinChangeFrames(): GridFrame[] {
  const coins = [1, 3, 4];
  const amount = 6;
  const INF = Infinity;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  const colLabels = Array.from({ length: amount + 1 }, (_, a) => String(a));
  const frames: GridFrame[] = [];

  const cell = (v: number) => (v === INF ? '∞' : v);
  const snap = (states: Record<number, CellState>, desc: string) =>
    frames.push({
      grid: [dp.map((v, a): GridCell => ({ value: cell(v), state: states[a] }))],
      colLabels,
      rowLabels: ['coins'],
      caption: `Fewest of {${coins.join(', ')}} to make each amount`,
      description: desc,
    });

  snap({ 0: 'chosen' }, 'dp[0] = 0 coins; every other amount starts at ∞.');
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) {
        dp[a] = dp[a - c] + 1;
        snap({ [a]: 'active', [a - c]: 'compare' }, `Amount ${a}: use coin ${c} → dp[${a}] = dp[${a - c}] + 1 = ${dp[a]}.`);
      }
    }
  }
  snap({ [amount]: 'chosen' }, `Amount ${amount} needs a minimum of ${dp[amount]} coins.`);
  return frames;
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
const knapsack: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: knapsackFrames,
  code: {
    javascript: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++)
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w)
        dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
    }
  return dp[n][W];
}`,
    python: `def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
    return dp[n][W]`,
  },
  meta: {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dp',
    difficulty: 'Medium',
    summary: 'Maximize value within a weight budget, each item taken at most once.',
    complexity: { time: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' }, space: 'O(nW)', recursive: false },
    description:
      'The 0/1 Knapsack problem chooses a subset of items — each with a weight and value — to maximize total value without exceeding a weight capacity W. Dynamic programming fills a table dp[i][w] representing the best value using the first i items within capacity w, deciding for each item whether to skip or take it.',
    whenToUse: 'Resource allocation with a hard budget and indivisible items.',
    advantages: ['Exact optimal solution via DP.', 'Pseudo-polynomial O(nW) time.'],
    disadvantages: ['Depends on capacity W — slow for huge capacities.', 'O(nW) memory (reducible to O(W)).'],
    applications: ['Budgeting and capital allocation.', 'Cargo loading and cutting-stock problems.'],
    steps: [
      'Build a table over items × capacities.',
      'For each item, choose the better of skipping or taking it.',
      'Taking it adds its value and consumes its weight.',
      'The bottom-right cell holds the optimal value.',
    ],
    pseudocode: `for i in 1..n
  for w in 0..W
    dp[i][w] = dp[i-1][w]
    if weight[i] <= w
      dp[i][w] = max(dp[i][w], value[i] + dp[i-1][w - weight[i]])`,
  },
};

const lcs: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: lcsFrames,
  code: {
    javascript: `function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}`,
    python: `def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
  },
  meta: {
    id: 'longest-common-subsequence',
    name: 'Longest Common Subsequence',
    category: 'dp',
    difficulty: 'Medium',
    summary: 'Longest sequence appearing in both strings in the same relative order.',
    complexity: { time: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' }, space: 'O(mn)', recursive: false },
    description:
      'The Longest Common Subsequence of two strings is the longest ordered (not necessarily contiguous) sequence of characters common to both. A DP table dp[i][j] stores the LCS length of the first i and j characters; matching characters extend the diagonal, mismatches take the best of dropping one character.',
    whenToUse: 'Diffing, DNA/sequence alignment, and similarity scoring.',
    advantages: ['Exact optimal length via DP.', 'Reconstructs the actual subsequence by backtracking.'],
    disadvantages: ['O(mn) time and memory (space reducible to O(min(m, n))).'],
    applications: ['File diff tools and version control.', 'Bioinformatics sequence alignment.'],
    steps: [
      'Build a table over the two strings’ prefixes.',
      'If characters match, extend the diagonal value by 1.',
      'Otherwise take the max of the left and top cells.',
      'The bottom-right cell holds the LCS length.',
    ],
    pseudocode: `if a[i] == b[j]
    dp[i][j] = dp[i-1][j-1] + 1
else
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
  },
};

const coinChange: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: coinChangeFrames,
  code: {
    javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const coin of coins)
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]`,
  },
  meta: {
    id: 'coin-change',
    name: 'Coin Change',
    category: 'dp',
    difficulty: 'Medium',
    summary: 'Fewest coins needed to make a target amount from given denominations.',
    complexity: {
      time: { best: 'O(n·amount)', average: 'O(n·amount)', worst: 'O(n·amount)' },
      space: 'O(amount)',
      recursive: false,
    },
    description:
      'The Coin Change problem asks for the minimum number of coins (from unlimited supplies of given denominations) that sum to a target amount. A 1-D DP array records the best count for every amount up to the target, relaxing it with each coin.',
    whenToUse: 'Making change optimally, and any unbounded-knapsack style counting problem.',
    advantages: ['Exact minimum via DP.', 'Simple 1-D table.'],
    disadvantages: ['Greedy fails for arbitrary coin systems — DP is required.', 'Cost scales with the amount.'],
    applications: ['Cash registers and vending machines.', 'Resource packing with reusable units.'],
    steps: [
      'Initialize dp[0] = 0 and the rest to infinity.',
      'For each amount, try every coin that fits.',
      'Take the minimum coin count over all choices.',
      'dp[amount] holds the answer (or infinity if impossible).',
    ],
    pseudocode: `dp[0] = 0
for a in 1..amount
    for coin in coins
        if coin <= a
            dp[a] = min(dp[a], dp[a - coin] + 1)`,
  },
};

const modules: AlgorithmModule[] = [knapsack, lcs, coinChange];
export default modules;
