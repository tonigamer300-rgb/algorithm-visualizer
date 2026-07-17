import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle, Gauge, BarChart3 } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  isFirst: boolean;
  isLast: boolean;
  index: number;
  total: number;
  speed: number;
  arraySize: number;
  showSizeControl: boolean;
  onToggle: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onSpeed: (v: number) => void;
  onSize: (v: number) => void;
  onScrub: (v: number) => void;
}

function Controls(props: ControlsProps) {
  return (
    <div className="space-y-5">
      <button onClick={props.onGenerate} className="btn-ghost w-full">
        <Shuffle className="h-4 w-4" /> Generate Random Data
      </button>

      <div className="grid grid-cols-4 gap-2">
        <button onClick={props.onStepBack} disabled={props.isFirst} className="btn-icon" aria-label="Step back">
          <SkipBack className="h-4 w-4" />
        </button>
        <button onClick={props.onToggle} className="btn-primary col-span-2" aria-label="Play or pause">
          {props.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {props.isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={props.onStepForward} disabled={props.isLast} className="btn-icon" aria-label="Step forward">
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      <button onClick={props.onReset} className="btn-ghost w-full">
        <RotateCcw className="h-4 w-4" /> Reset
      </button>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
          <span>Step</span>
          <span className="tabular-nums">
            {props.index + 1} / {props.total}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(0, props.total - 1)}
          value={props.index}
          onChange={(e) => props.onScrub(Number(e.target.value))}
          className="w-full accent-brand"
          aria-label="Scrub steps"
        />
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
          <Gauge className="h-3.5 w-3.5" /> Speed — {props.speed.toFixed(1)}×
        </label>
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={props.speed}
          onChange={(e) => props.onSpeed(Number(e.target.value))}
          className="w-full accent-brand"
        />
      </div>

      {props.showSizeControl && (
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
            <BarChart3 className="h-3.5 w-3.5" /> Array Size — {props.arraySize}
          </label>
          <input
            type="range"
            min={5}
            max={60}
            value={props.arraySize}
            onChange={(e) => props.onSize(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      )}
    </div>
  );
}

export default Controls;
