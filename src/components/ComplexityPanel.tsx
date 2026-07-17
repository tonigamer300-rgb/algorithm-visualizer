import { Check, Minus } from 'lucide-react';
import type { Complexity } from '@/types';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-950/50 px-3 py-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-mono text-sm text-white">{value}</span>
    </div>
  );
}

function Flag({ label, value }: { label: string; value?: boolean }) {
  if (value === undefined) return null;
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface-950/50 px-3 py-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={value ? 'text-emerald-400' : 'text-slate-500'}>
        {value ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </span>
    </div>
  );
}

function ComplexityPanel({ complexity }: { complexity: Complexity }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Time Complexity
        </h4>
        <div className="space-y-1.5">
          <Row label="Best" value={complexity.time.best} />
          <Row label="Average" value={complexity.time.average} />
          <Row label="Worst" value={complexity.time.worst} />
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Space & Properties
        </h4>
        <div className="space-y-1.5">
          <Row label="Space" value={complexity.space} />
          <Flag label="Stable" value={complexity.stable} />
          <Flag label="In-place" value={complexity.inPlace} />
          <Flag label="Recursive" value={complexity.recursive} />
        </div>
      </div>
    </div>
  );
}

export default ComplexityPanel;
