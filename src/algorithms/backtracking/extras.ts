import type { AlgorithmModule } from '@/types';
import { definePlaceholder } from '../_placeholder';

const sudoku = definePlaceholder(
  {
    id: 'sudoku-solver',
    name: 'Sudoku Solver',
    category: 'backtracking',
    difficulty: 'Hard',
    summary: 'Fills a 9×9 grid by trying digits and backtracking on conflicts.',
    complexity: {
      time: { best: 'O(1)', average: 'O(9^m)', worst: 'O(9^m)' },
      space: 'O(1)',
      recursive: true,
    },
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
  {
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
  }
);

const nQueens = definePlaceholder(
  {
    id: 'n-queens',
    name: 'N-Queens',
    category: 'backtracking',
    difficulty: 'Hard',
    summary: 'Place N queens on an N×N board so none attack each other.',
    complexity: {
      time: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
      space: 'O(N)',
      recursive: true,
    },
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
  {
    javascript: `function solveNQueens(n) {
  const res = [], cols = new Set(), d1 = new Set(), d2 = new Set(), pos = [];
  (function place(r) {
    if (r === n) { res.push([...pos]); return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); pos.push(c);
      place(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c); pos.pop();
    }
  })(0);
  return res;
}`,
    python: `def solve_n_queens(n):
    res, cols, d1, d2, pos = [], set(), set(), set(), []
    def place(r):
        if r == n:
            res.append(pos[:]); return
        for c in range(n):
            if c in cols or (r - c) in d1 or (r + c) in d2:
                continue
            cols.add(c); d1.add(r - c); d2.add(r + c); pos.append(c)
            place(r + 1)
            cols.discard(c); d1.discard(r - c); d2.discard(r + c); pos.pop()
    place(0)
    return res`,
  }
);

const maze = definePlaceholder(
  {
    id: 'maze-solver',
    name: 'Maze Solver',
    category: 'backtracking',
    difficulty: 'Medium',
    summary: 'Finds a path through a grid maze by exploring and backtracking at dead ends.',
    complexity: {
      time: { best: 'O(1)', average: 'O(4^(mn))', worst: 'O(4^(mn))' },
      space: 'O(mn)',
      recursive: true,
    },
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
  {
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
  }
);

const modules: AlgorithmModule[] = [sudoku, nQueens, maze];
export default modules;
