import { motion } from 'framer-motion';
import type { HanoiFrame, VisualizerProps } from '@/types';
import { cn } from '@/utils/cn';

/** Renders three pegs with stacked disks for the Towers of Hanoi. */
function HanoiVisualizer({ frame }: VisualizerProps) {
  const { pegs, moving, description } = frame as HanoiFrame;
  const maxDisk = Math.max(1, ...pegs.flat());
  const pegNames = ['A', 'B', 'C'];

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-end justify-around gap-4 px-4 pb-6 pt-8">
        {pegs.map((peg, p) => (
          <div key={p} className="flex flex-1 flex-col items-center">
            <div className="relative flex w-full flex-col-reverse items-center gap-1" style={{ minHeight: 160 }}>
              {/* Peg rod */}
              <div className="absolute bottom-0 h-full w-1 rounded bg-slate-600" />
              {peg.map((disk, i) => (
                <motion.div
                  key={`${disk}-${i}`}
                  layout
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className={cn(
                    'z-10 h-5 rounded-md',
                    moving === disk ? 'ring-2 ring-amber-300' : ''
                  )}
                  style={{
                    width: `${30 + (disk / maxDisk) * 70}%`,
                    backgroundColor: `hsl(${210 + (disk / maxDisk) * 130} 75% 58%)`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 h-1 w-full rounded bg-slate-700" />
            <span className="mt-1 text-xs font-medium text-slate-400">{pegNames[p]}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-3 pt-2">
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

export default HanoiVisualizer;
