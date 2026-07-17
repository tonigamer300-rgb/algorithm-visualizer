import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network, TreePine, Repeat, Grid3x3, Boxes } from 'lucide-react';
import type { Category } from '@/types';
import { mulberry32 } from '@/utils/random';

/**
 * Lightweight looping preview shown on each algorithm card. Array-based
 * categories get animated bars; others get a subtly floating category icon.
 */
function MiniPreview({ category, id }: { category: Category; id: string }) {
  // Derive a stable per-card layout from the id so previews look distinct.
  const bars = useMemo(() => {
    let h = 0;
    for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
    const rand = mulberry32(Math.abs(h) + 1);
    return Array.from({ length: 12 }, () => 0.25 + rand() * 0.75);
  }, [id]);

  if (category === 'sorting' || category === 'searching') {
    return (
      <div className="flex h-full items-end justify-center gap-1 p-2">
        {bars.map((v, i) => (
          <motion.span
            key={i}
            className="w-2 rounded-sm bg-brand/70"
            initial={{ height: `${v * 100}%` }}
            animate={{ height: [`${v * 100}%`, `${bars[(i + 3) % bars.length] * 100}%`, `${v * 100}%`] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
          />
        ))}
      </div>
    );
  }

  const Icon =
    category === 'graph'
      ? Network
      : category === 'trees'
        ? TreePine
        : category === 'recursion'
          ? Repeat
          : category === 'backtracking'
            ? Grid3x3
            : Boxes;

  return (
    <div className="grid h-full place-items-center">
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <Icon className="h-9 w-9 text-brand/70" />
      </motion.div>
    </div>
  );
}

export default MiniPreview;
