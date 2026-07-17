import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Shuffle, Star } from 'lucide-react';
import { ALGORITHMS, CATEGORIES } from '@/algorithms/registry';
import type { Category } from '@/types';
import AlgorithmCard from '@/components/AlgorithmCard';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/utils/cn';

function AlgorithmsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { favorites } = useSettings();
  const [query, setQuery] = useState('');
  const [onlyFavs, setOnlyFavs] = useState(false);

  const category = (params.get('category') as Category | null) ?? 'all';

  const setCategory = (c: Category | 'all') => {
    if (c === 'all') setParams({});
    else setParams({ category: c });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALGORITHMS.filter((a) => {
      if (category !== 'all' && a.meta.category !== category) return false;
      if (onlyFavs && !favorites.includes(a.meta.id)) return false;
      if (!q) return true;
      return (
        a.meta.name.toLowerCase().includes(q) ||
        a.meta.summary.toLowerCase().includes(q) ||
        a.meta.category.toLowerCase().includes(q)
      );
    });
  }, [query, category, onlyFavs, favorites]);

  const randomAlgorithm = () => {
    const pick = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
    navigate(`/visualize/${pick.meta.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Algorithms</h1>
          <p className="mt-1 text-slate-400">
            {results.length} of {ALGORITHMS.length} algorithms
          </p>
        </div>
        <button onClick={randomAlgorithm} className="btn-ghost">
          <Shuffle className="h-4 w-4" /> Random algorithm
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms…"
            className="w-full rounded-xl border border-white/10 bg-surface-800/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand/50 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setOnlyFavs((v) => !v)}
          className={cn('btn-ghost', onlyFavs && 'border-amber-400/40 text-amber-300')}
        >
          <Star className={cn('h-4 w-4', onlyFavs && 'fill-amber-400 text-amber-400')} /> Favorites
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
          All
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.label}
          </FilterChip>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-slate-500">No algorithms match your filters.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((a) => (
            <AlgorithmCard key={a.meta.id} meta={a.meta} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-brand/50 bg-brand/15 text-brand'
          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
      )}
    >
      {children}
    </button>
  );
}

export default AlgorithmsPage;
