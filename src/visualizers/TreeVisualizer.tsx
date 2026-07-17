import { motion } from 'framer-motion';
import type { TreeFrame, TreeNodeState, VisualizerProps } from '@/types';
import { cn } from '@/utils/cn';

const STATE_FILL: Record<TreeNodeState, string> = {
  active: 'fill-amber-400',
  compare: 'fill-sky-400',
  visited: 'fill-brand',
  placed: 'fill-emerald-500',
  return: 'fill-fuchsia-500',
  path: 'fill-emerald-400',
};

/**
 * Renders a tree (BST/heap/AVL/red-black) or a recursion call tree. Node
 * coordinates are supplied by the algorithm on a 0–100 grid; this component
 * only draws them, so it works for any tree-shaped frame.
 */
function TreeVisualizer({ frame }: VisualizerProps) {
  const { nodes, edges, description } = frame as TreeFrame;
  const pos = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="flex h-full flex-col">
      <svg viewBox="0 0 100 100" className="flex-1" preserveAspectRatio="xMidYMid meet">
        {edges.map((e, i) => {
          const a = pos(e.from);
          const b = pos(e.to);
          if (!a || !b) return null;
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-slate-600" strokeWidth={0.5} />
          );
        })}
        {nodes.map((n) => {
          const fill = n.color
            ? n.color === 'red'
              ? 'fill-rose-500'
              : 'fill-slate-800'
            : n.state
              ? STATE_FILL[n.state]
              : 'fill-slate-700';
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: n.state === 'active' ? 1.18 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={4.6}
                className={cn(fill, n.color === 'black' ? 'stroke-white/40' : 'stroke-white/20')}
                strokeWidth={n.color ? 0.5 : 0.3}
              />
              <text
                x={n.x}
                y={n.y + 1.3}
                textAnchor="middle"
                className="fill-white font-semibold"
                style={{ fontSize: 3.2 }}
              >
                {n.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <div className="border-t border-white/10 px-3 pt-2">
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </div>
  );
}

export default TreeVisualizer;
