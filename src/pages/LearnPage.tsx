import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { ALGORITHMS, CATEGORIES } from '@/algorithms/registry';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/utils/cn';

function LearnPage() {
  const { completed } = useSettings();
  const total = ALGORITHMS.length;
  const done = completed.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Learn</h1>
      <p className="mt-1 text-slate-400">
        Work through each category. Your progress is saved locally as you explore.
      </p>

      {/* Progress tracker */}
      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
              <Trophy className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-white">Your progress</p>
              <p className="text-sm text-slate-400">
                {done} of {total} algorithms explored
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-white">{pct}%</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-surface-950">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Category sections */}
      <div className="mt-8 space-y-8">
        {CATEGORIES.map((c) => {
          const items = ALGORITHMS.filter((a) => a.meta.category === c.id);
          return (
            <section key={c.id}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-white">{c.label}</h2>
                <span className="text-xs text-slate-500">{items.length} algorithms</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((a) => {
                  const isDone = completed.includes(a.meta.id);
                  return (
                    <Link
                      key={a.meta.id}
                      to={`/visualize/${a.meta.id}`}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-800/50 px-4 py-3 transition-colors hover:border-brand/40"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-slate-600" />
                      )}
                      <div className="min-w-0">
                        <p className={cn('truncate text-sm font-medium', isDone ? 'text-slate-300' : 'text-white')}>
                          {a.meta.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">{a.meta.summary}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default LearnPage;
