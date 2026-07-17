import { motion } from 'framer-motion';
import type { CellState, GridFrame, VisualizerProps } from '@/types';
import { cn } from '@/utils/cn';

/** Background color for each cell state. */
const STATE_BG: Record<CellState, string> = {
  active: 'bg-amber-400/90 text-slate-900',
  compare: 'bg-sky-400/80 text-slate-900',
  chosen: 'bg-emerald-500/90 text-white',
  best: 'bg-fuchsia-500/80 text-white',
  conflict: 'bg-rose-500/90 text-white',
  path: 'bg-emerald-400/80 text-slate-900',
  wall: 'bg-slate-700 text-slate-700',
  visited: 'bg-brand/40 text-white',
  fixed: 'bg-white/10 text-white',
  start: 'bg-emerald-500 text-white',
  goal: 'bg-rose-400 text-white',
};

const LEGEND: { state: CellState; label: string }[] = [
  { state: 'active', label: 'Current' },
  { state: 'compare', label: 'Considering' },
  { state: 'chosen', label: 'Chosen / best' },
  { state: 'conflict', label: 'Conflict' },
];

function GridVisualizer({ frame }: VisualizerProps) {
  const { grid, rowLabels, colLabels, caption, boxSize, description } = frame as GridFrame;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  // Scale cell size down as the grid grows so large tables still fit.
  const cell = Math.max(16, Math.min(46, Math.floor(360 / Math.max(rows, cols))));

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 overflow-auto p-2">
        {caption && <p className="font-mono text-xs text-slate-400">{caption}</p>}
        <div className="inline-block">
          {colLabels && (
            <div className="flex" style={{ paddingLeft: rowLabels ? cell : 0 }}>
              {colLabels.map((c, i) => (
                <div
                  key={i}
                  className="grid place-items-center text-[10px] font-medium text-slate-500"
                  style={{ width: cell, height: 18 }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {rowLabels && (
                <div
                  className="grid place-items-center text-[10px] font-medium text-slate-500"
                  style={{ width: cell, height: cell }}
                >
                  {rowLabels[r]}
                </div>
              )}
              {row.map((c, ci) => (
                <motion.div
                  key={ci}
                  initial={false}
                  animate={{ scale: c.state === 'active' ? 1.08 : 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className={cn(
                    'grid place-items-center border border-white/10 font-mono tabular-nums',
                    c.state ? STATE_BG[c.state] : 'bg-surface-950/60 text-slate-300',
                    !!boxSize && (ci + 1) % boxSize === 0 && ci !== cols - 1 && 'border-r-2 border-r-white/30',
                    !!boxSize && (r + 1) % boxSize === 0 && r !== rows - 1 && 'border-b-2 border-b-white/30'
                  )}
                  style={{ width: cell, height: cell, fontSize: cell > 26 ? 13 : 10 }}
                >
                  {c.value === 0 && c.state === 'wall' ? '' : c.value}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 pt-2">
        <p className="text-sm text-slate-300">{description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          {LEGEND.map((l) => (
            <span key={l.state} className="flex items-center gap-1">
              <span className={cn('h-2.5 w-2.5 rounded-sm', STATE_BG[l.state].split(' ')[0])} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GridVisualizer;
