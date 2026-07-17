import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { ArrayFrame, VisualizerProps } from '@/types';

/**
 * Fallback visualizer for algorithms that are fully documented but not yet
 * animated. It still participates in the shared step controls: each conceptual
 * step is a frame, so users can play / step through the walkthrough while an
 * interactive canvas is developed.
 */
function PlaceholderVisualizer({ frame }: VisualizerProps) {
  const { description } = frame as ArrayFrame;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="chip">
        <Sparkles className="h-3.5 w-3.5" /> Guided walkthrough
      </span>
      <motion.p
        key={description}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-2xl text-lg leading-relaxed text-slate-200"
      >
        {description}
      </motion.p>
      <p className="text-xs text-slate-500">
        Use the controls to step through each stage. An interactive canvas for this
        algorithm is on the roadmap — contributions welcome.
      </p>
    </div>
  );
}

export default PlaceholderVisualizer;
