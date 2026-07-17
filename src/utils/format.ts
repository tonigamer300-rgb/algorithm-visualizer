import type { Category, Difficulty } from '@/types';

export const categoryLabels: Record<Category, string> = {
  sorting: 'Sorting',
  searching: 'Searching',
  graph: 'Graph',
  trees: 'Trees',
  recursion: 'Recursion',
  dp: 'Dynamic Programming',
  backtracking: 'Backtracking',
};

/** Tailwind color classes used for difficulty chips across the app. */
export const difficultyColor: Record<Difficulty, string> = {
  Easy: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  Medium: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  Hard: 'text-rose-300 border-rose-400/30 bg-rose-400/10',
};
