import { motion } from 'framer-motion';
import type { ArrayFrame, HighlightKind, VisualizerProps } from '@/types';
import { cn } from '@/utils/cn';

/** Color + label for each highlight state, shown in the on-canvas legend. */
const HIGHLIGHTS: Record<HighlightKind, { bar: string; label: string }> = {
  compare: { bar: 'bg-amber-300', label: 'Comparing' },
  swap: { bar: 'bg-rose-500', label: 'Swapping' },
  sorted: { bar: 'bg-emerald-400', label: 'Sorted (in place)' },
  pivot: { bar: 'bg-fuchsia-500', label: 'Pivot' },
  active: { bar: 'bg-sky-400', label: 'Active' },
  found: { bar: 'bg-emerald-400', label: 'Found' },
  range: { bar: 'bg-brand/70', label: 'Search range' },
  min: { bar: 'bg-purple-400', label: 'Current min' },
};

/**
 * Map a value to a vivid color so each column encodes its magnitude: short bars
 * are blue, growing through purple, pink, red and orange up to yellow for the
 * tallest. The hue sweeps past 360° so it never passes through green — green is
 * reserved for bars that have settled into their final sorted position.
 */
function valueColor(value: number, max: number): string {
  const t = max > 0 ? value / max : 0;
  const hue = (222 + t * 188) % 360; // blue → pink → orange → yellow
  return `hsl(${hue} 88% 60%)`;
}

function ArrayVisualizer({ frame }: VisualizerProps) {
  const { array, highlights, pointers, description } = frame as ArrayFrame;
  const max = Math.max(1, ...array);
  const showValues = array.length <= 20;

  // Only surface legend entries that are actually present in this frame.
  const usedKinds = Array.from(new Set(Object.values(highlights))) as HighlightKind[];

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 items-stretch justify-center gap-[2px] px-3 pb-1">
        {array.map((value, i) => {
          const kind = highlights[i];
          return (
            <div key={i} className="flex flex-1 flex-col" style={{ maxWidth: 44 }}>
              {/* Bar area — flex-1 gives it a definite height so the bar's
                  percentage height resolves correctly. */}
              <div className="relative flex min-h-0 flex-1 items-end">
                {pointers
                  ?.filter((p) => p.index === i)
                  .map((p) => (
                    <span
                      key={p.label}
                      className="absolute left-1/2 top-0 -translate-x-1/2 rounded bg-brand px-1 text-[10px] font-semibold text-white"
                    >
                      {p.label}
                    </span>
                  ))}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className={cn(
                    'w-full rounded-t-[3px] transition-colors duration-200',
                    kind && HIGHLIGHTS[kind].bar,
                    kind === 'sorted' && 'shadow-[0_0_10px_rgba(52,211,153,0.55)]'
                  )}
                  style={{
                    height: `${Math.max(2, (value / max) * 100)}%`,
                    ...(kind ? {} : { backgroundColor: valueColor(value, max) }),
                  }}
                />
              </div>
              {showValues && (
                <span className="mt-1 text-center text-[10px] tabular-nums text-slate-400">{value}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 pt-2">
        <p className="text-sm text-slate-300">{description}</p>
        {usedKinds.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {usedKinds.map((k) => (
              <span key={k} className="flex items-center gap-1 text-xs text-slate-400">
                <span className={cn('h-2.5 w-2.5 rounded-sm', HIGHLIGHTS[k].bar)} />
                {HIGHLIGHTS[k].label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArrayVisualizer;
