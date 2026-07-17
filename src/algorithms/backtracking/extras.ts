import type { AlgorithmModule, CellState, GridCell, GridFrame } from '@/types';

// ---------------------------------------------------------------------------
// N-Queens — place queens row by row, backtracking on conflicts
// ---------------------------------------------------------------------------
function nQueensFrames(): GridFrame[] {
  const N = 6;
  const queens = new Array(N).fill(-1); // queens[row] = col
  const frames: GridFrame[] = [];

  const build = (extra: Record<string, CellState>, desc: string) => {
    const grid: GridCell[][] = Array.from({ length: N }, (_, r) =>
      Array.from({ length: N }, (_, c): GridCell => {
        const key = `${r},${c}`;
        if (queens[r] === c) return { value: '♛', state: extra[key] ?? 'chosen' };
        return { value: '', state: extra[key] };
      })
    );
    frames.push({ grid, caption: `${N}-Queens board`, description: desc });
  };

  const safe = (r: number, c: number) => {
    for (let i = 0; i < r; i++) {
      if (queens[i] === c || Math.abs(queens[i] - c) === r - i) return false;
    }
    return true;
  };

  const solve = (r: number): boolean => {
    if (r === N) {
      build({}, 'All queens placed — no two attack each other!');
      return true;
    }
    for (let c = 0; c < N; c++) {
      build({ [`${r},${c}`]: 'compare' }, `Row ${r}: try column ${c}.`);
      if (safe(r, c)) {
        queens[r] = c;
        build({ [`${r},${c}`]: 'chosen' }, `Column ${c} is safe — place a queen.`);
        if (solve(r + 1)) return true;
        build({ [`${r},${c}`]: 'conflict' }, `Dead end below row ${r} — backtrack.`);
        queens[r] = -1;
      } else {
        build({ [`${r},${c}`]: 'conflict' }, `Column ${c} is attacked — skip.`);
      }
    }
    return false;
  };

  build({}, `Place ${N} queens so none share a row, column or diagonal.`);
  solve(0);
  return frames;
}

// ---------------------------------------------------------------------------
// Sudoku Solver — fill blanks by trying digits and backtracking
// ---------------------------------------------------------------------------
function sudokuFrames(): GridFrame[] {
  const solved = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];
  const blanks: [number, number][] = [
    [0, 2], [0, 5], [1, 0], [2, 4], [4, 4], [5, 8], [6, 3], [7, 7], [8, 1],
  ];
  const board = solved.map((row) => [...row]);
  const given = new Set<string>();
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) given.add(`${r},${c}`);
  for (const [r, c] of blanks) {
    board[r][c] = 0;
    given.delete(`${r},${c}`);
  }

  const frames: GridFrame[] = [];
  const build = (extra: Record<string, CellState>, desc: string) => {
    const grid: GridCell[][] = board.map((row, r) =>
      row.map((v, c): GridCell => ({
        value: v === 0 ? '' : v,
        state: extra[`${r},${c}`] ?? (given.has(`${r},${c}`) ? 'fixed' : undefined),
      }))
    );
    frames.push({ grid, boxSize: 3, caption: 'Sudoku (fixed clues shaded)', description: desc });
  };

  const valid = (r: number, c: number, d: number) => {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === d || board[i][c] === d) return false;
    }
    const br = 3 * Math.floor(r / 3);
    const bc = 3 * Math.floor(c / 3);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[br + i][bc + j] === d) return false;
    return true;
  };

  const solve = (): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== 0) continue;
        for (let d = 1; d <= 9; d++) {
          build({ [`${r},${c}`]: 'active' }, `Cell (${r},${c}): try ${d}.`);
          if (valid(r, c, d)) {
            board[r][c] = d;
            build({ [`${r},${c}`]: 'chosen' }, `${d} fits at (${r},${c}).`);
            if (solve()) return true;
            board[r][c] = 0;
            build({ [`${r},${c}`]: 'conflict' }, `No solution with ${d} here — backtrack.`);
          }
        }
        return false;
      }
    }
    return true;
  };

  build({}, 'Fill each empty cell with 1–9 respecting row, column and 3×3 box rules.');
  solve();
  build({}, 'Solved — every row, column and box contains 1–9 exactly once.');
  return frames;
}

// ---------------------------------------------------------------------------
// Maze Solver — DFS with backtracking from start to goal
// ---------------------------------------------------------------------------
function mazeFrames(): GridFrame[] {
  // 0 = open, 1 = wall
  const maze = [
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const R = maze.length;
  const C = maze[0].length;
  const start: [number, number] = [0, 0];
  const goal: [number, number] = [6, 8];
  const state: Record<string, CellState> = {};
  const frames: GridFrame[] = [];

  const build = (desc: string) => {
    const grid: GridCell[][] = maze.map((row, r) =>
      row.map((v, c): GridCell => {
        const key = `${r},${c}`;
        if (r === start[0] && c === start[1]) return { value: 'S', state: 'start' };
        if (r === goal[0] && c === goal[1]) return { value: 'G', state: state[key] ?? 'goal' };
        if (v === 1) return { value: 0, state: 'wall' };
        return { value: '', state: state[key] };
      })
    );
    frames.push({ grid, caption: 'Maze — S to G', description: desc });
  };

  build('Explore from S; step into open neighbors and backtrack at dead ends.');
  const dirs = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];
  const solve = (r: number, c: number): boolean => {
    if (r === goal[0] && c === goal[1]) {
      state[`${r},${c}`] = 'path';
      build('Reached the goal!');
      return true;
    }
    state[`${r},${c}`] = 'visited';
    if (!(r === start[0] && c === start[1])) build(`Visit (${r},${c}).`);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
      if (maze[nr][nc] === 1 || state[key]) continue;
      if (solve(nr, nc)) {
        state[`${r},${c}`] = 'path';
        return true;
      }
    }
    return false;
  };
  solve(start[0], start[1]);
  build('Green marks the successful path from S to G.');
  return frames;
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
const nQueens: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: nQueensFrames,
  code: {
    javascript: `function solveNQueens(n) {
  const queens = Array(n).fill(-1);
  const safe = (r, c) => queens.slice(0, r).every((qc, i) =>
    qc !== c && Math.abs(qc - c) !== r - i);
  const place = (r) => {
    if (r === n) return true;
    for (let c = 0; c < n; c++)
      if (safe(r, c)) { queens[r] = c; if (place(r + 1)) return true; queens[r] = -1; }
    return false;
  };
  place(0);
  return queens;
}`,
    python: `def solve_n_queens(n):
    queens = [-1] * n
    def safe(r, c):
        return all(queens[i] != c and abs(queens[i] - c) != r - i for i in range(r))
    def place(r):
        if r == n:
            return True
        for c in range(n):
            if safe(r, c):
                queens[r] = c
                if place(r + 1):
                    return True
                queens[r] = -1
        return False
    place(0)
    return queens`,
  },
  meta: {
    id: 'n-queens',
    name: 'N-Queens',
    category: 'backtracking',
    difficulty: 'Hard',
    summary: 'Place N queens on an N×N board so none attack each other.',
    complexity: { time: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' }, space: 'O(N)', recursive: true },
    description:
      'The N-Queens problem places N chess queens on an N×N board so that no two share a row, column or diagonal. Backtracking places one queen per row, trying each safe column and recursing; when a row has no safe square, it backtracks to the previous row.',
    whenToUse: 'Teaching backtracking, constraint pruning and combinatorial search.',
    advantages: ['Finds all solutions.', 'Diagonal/column tracking prunes heavily.'],
    disadvantages: ['Factorial growth of the search space.'],
    applications: ['Constraint-satisfaction demos.', 'Testbed for search heuristics.'],
    steps: [
      'Place a queen in the current row’s first safe column.',
      'Recurse to the next row.',
      'If no column is safe, backtrack to the previous row.',
      'Record a solution when all rows are filled.',
    ],
    pseudocode: `place(row)
    if row == N: record solution; return
    for col in 0..N-1
        if safe(row, col)
            put queen; place(row + 1); remove queen`,
  },
};

const sudoku: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: sudokuFrames,
  code: {
    javascript: `function solve(board) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c] === 0) {
        for (let d = 1; d <= 9; d++)
          if (valid(board, r, c, d)) {
            board[r][c] = d;
            if (solve(board)) return true;
            board[r][c] = 0;
          }
        return false;
      }
  return true;
}`,
    python: `def solve(board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                for d in range(1, 10):
                    if valid(board, r, c, d):
                        board[r][c] = d
                        if solve(board):
                            return True
                        board[r][c] = 0
                return False
    return True`,
  },
  meta: {
    id: 'sudoku-solver',
    name: 'Sudoku Solver',
    category: 'backtracking',
    difficulty: 'Hard',
    summary: 'Fills a 9×9 grid by trying digits and backtracking on conflicts.',
    complexity: { time: { best: 'O(1)', average: 'O(9^m)', worst: 'O(9^m)' }, space: 'O(1)', recursive: true },
    description:
      'A Sudoku Solver uses backtracking: it finds the next empty cell, tries each digit 1–9 that does not violate the row, column and 3×3 box constraints, and recurses. If no digit works it backtracks, undoing the last choice. Constraint checking prunes the search dramatically.',
    whenToUse: 'Constraint-satisfaction puzzles and any fill-and-check search.',
    advantages: ['Guaranteed to find a solution if one exists.', 'Constraint pruning keeps it practical.'],
    disadvantages: ['Exponential worst case.', 'Naive ordering can be slow on hard boards.'],
    applications: ['Puzzle solving.', 'General constraint-satisfaction problems.'],
    steps: [
      'Find the next empty cell.',
      'Try a digit that satisfies row, column and box.',
      'Recurse to fill the rest.',
      'If stuck, erase the digit and try the next (backtrack).',
    ],
    pseudocode: `solve(board)
    cell = findEmpty(board)
    if none: return true
    for d in 1..9
        if valid(board, cell, d)
            place d; if solve(board): return true; erase d
    return false`,
  },
};

const maze: AlgorithmModule = {
  visualizer: 'grid',
  generateFrames: mazeFrames,
  code: {
    javascript: `function solveMaze(grid, r, c, goal, seen = new Set()) {
  if (r === goal[0] && c === goal[1]) return true;
  seen.add(r + ',' + c);
  for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    const nr = r + dr, nc = c + dc;
    if (grid[nr]?.[nc] === 0 && !seen.has(nr + ',' + nc))
      if (solveMaze(grid, nr, nc, goal, seen)) return true;
  }
  return false;
}`,
    python: `def solve_maze(grid, r, c, goal, seen=None):
    if seen is None:
        seen = set()
    if (r, c) == goal:
        return True
    seen.add((r, c))
    for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) \\
                and grid[nr][nc] == 0 and (nr, nc) not in seen:
            if solve_maze(grid, nr, nc, goal, seen):
                return True
    return False`,
  },
  meta: {
    id: 'maze-solver',
    name: 'Maze Solver',
    category: 'backtracking',
    difficulty: 'Medium',
    summary: 'Finds a path through a grid maze by exploring and backtracking at dead ends.',
    complexity: { time: { best: 'O(1)', average: 'O(4^(mn))', worst: 'O(4^(mn))' }, space: 'O(mn)', recursive: true },
    description:
      'A Maze Solver searches a grid from start to goal, moving into open neighboring cells and marking them visited. When it hits a dead end it backtracks to the last cell with an untried direction. (Breadth-first search finds the shortest path; backtracking finds a path and is a natural recursion example.)',
    whenToUse: 'Grid pathfinding demonstrations and reachability checks.',
    advantages: ['Simple recursive exploration.', 'Finds a path if one exists.'],
    disadvantages: ['Backtracking does not guarantee the shortest path.', 'Can be slow on open mazes.'],
    applications: ['Game and robot navigation.', 'Reachability and flood-fill.'],
    steps: [
      'Move into an open, unvisited neighbor.',
      'Mark the cell visited and recurse.',
      'On reaching the goal, report success.',
      'At a dead end, backtrack and try another direction.',
    ],
    pseudocode: `solve(cell)
    if cell == goal: return true
    mark visited
    for dir in [up, down, left, right]
        n = cell + dir
        if open(n) and not visited(n) and solve(n): return true
    return false`,
  },
};

const modules: AlgorithmModule[] = [nQueens, sudoku, maze];
export default modules;
