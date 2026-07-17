import { motion } from 'framer-motion';
import type { GraphFrame, VisualizerProps } from '@/types';
import { NODES, EDGES } from '@/algorithms/graph/_graph';
import { cn } from '@/utils/cn';

/**
 * Renders the shared sample graph as an SVG and colors nodes/edges according to
 * the current traversal frame: visited, frontier (in the queue/stack) and the
 * node currently being processed.
 */
function GraphVisualizer({ frame }: VisualizerProps) {
  const { visited, frontier, current, path, description } = frame as GraphFrame;
  const visitedSet = new Set(visited);
  const frontierSet = new Set(frontier);
  const pathSet = new Set(path);

  const pos = (id: string) => NODES.find((n) => n.id === id)!;

  const edgeActive = (a: string, b: string) =>
    pathSet.has(a) && pathSet.has(b);

  return (
    <div className="flex h-full flex-col">
      <svg viewBox="0 0 100 100" className="flex-1" preserveAspectRatio="xMidYMid meet">
        {EDGES.map((e) => {
          const a = pos(e.from);
          const b = pos(e.to);
          const active = edgeActive(e.from, e.to);
          return (
            <g key={`${e.from}-${e.to}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={cn(active ? 'stroke-brand' : 'stroke-slate-600')}
                strokeWidth={active ? 0.9 : 0.5}
              />
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 1}
                className="fill-slate-500"
                style={{ fontSize: 2.4 }}
                textAnchor="middle"
              >
                {e.weight}
              </text>
            </g>
          );
        })}

        {NODES.map((n) => {
          const isCurrent = current === n.id;
          const isVisited = visitedSet.has(n.id);
          const isFrontier = frontierSet.has(n.id);
          const fill = isCurrent
            ? 'fill-amber-400'
            : isVisited
              ? 'fill-emerald-500'
              : isFrontier
                ? 'fill-brand'
                : 'fill-slate-700';
          return (
            <motion.g
              key={n.id}
              initial={false}
              animate={{ scale: isCurrent ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            >
              <circle cx={n.x} cy={n.y} r={4.2} className={cn(fill, 'stroke-white/20')} strokeWidth={0.3} />
              <text
                x={n.x}
                y={n.y + 1.2}
                textAnchor="middle"
                className="fill-white font-semibold"
                style={{ fontSize: 3.2 }}
              >
                {n.id}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-3 pt-2">
        <p className="text-sm text-slate-300">{description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Current
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" /> Frontier
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Visited
          </span>
        </div>
      </div>
    </div>
  );
}

export default GraphVisualizer;
