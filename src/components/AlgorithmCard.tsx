import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Database, CheckCircle2 } from 'lucide-react';
import type { AlgorithmMeta } from '@/types';
import { useSettings } from '@/context/SettingsContext';
import { categoryLabels, difficultyColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import MiniPreview from './MiniPreview';

function AlgorithmCard({ meta }: { meta: AlgorithmMeta }) {
  const { favorites, toggleFavorite, completed } = useSettings();
  const isFav = favorites.includes(meta.id);
  const isDone = completed.includes(meta.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative"
    >
      <Link
        to={`/visualize/${meta.id}`}
        className="card block h-full overflow-hidden p-4 transition-shadow hover:border-brand/40 hover:shadow-glow"
      >
        <div className="mb-3 h-20 overflow-hidden rounded-xl bg-surface-950/60">
          <MiniPreview category={meta.category} id={meta.id} />
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white">{meta.name}</h3>
            <p className="text-xs text-slate-400">{categoryLabels[meta.category]}</p>
          </div>
          <span
            className={cn(
              'chip shrink-0 border',
              difficultyColor[meta.difficulty]
            )}
          >
            {meta.difficulty}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-slate-400">{meta.summary}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {meta.complexity.time.average}
          </span>
          <span className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5" /> {meta.complexity.space}
          </span>
          {isDone && (
            <span className="ml-auto flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Viewed
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleFavorite(meta.id)}
        aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg bg-surface-950/70 backdrop-blur transition-colors hover:bg-surface-800"
      >
        <Star className={cn('h-4 w-4', isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-400')} />
      </button>
    </motion.div>
  );
}

export default AlgorithmCard;
