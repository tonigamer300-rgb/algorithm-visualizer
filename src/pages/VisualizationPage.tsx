import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Maximize2, Share2, Check, Star, Keyboard } from 'lucide-react';
import { getAlgorithm, getCategoryMeta } from '@/algorithms/registry';
import { VISUALIZERS } from '@/visualizers';
import { useStepPlayer } from '@/hooks/useStepPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSettings } from '@/context/SettingsContext';
import Controls from '@/components/Controls';
import Tabs from '@/components/Tabs';
import CodeViewer from '@/components/CodeViewer';
import ComplexityPanel from '@/components/ComplexityPanel';
import Spinner from '@/components/Spinner';
import { difficultyColor } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { AlgorithmMeta } from '@/types';

function VisualizationPage() {
  const { id = '' } = useParams();
  const module = getAlgorithm(id);
  const { settings, update, favorites, toggleFavorite, markCompleted } = useSettings();

  const [size, setSize] = useState(settings.arraySize);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [copied, setCopied] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (module) markCompleted(module.meta.id);
  }, [module, markCompleted]);

  const frames = useMemo(
    () => module?.generateFrames?.(size, seed) ?? [],
    [module, size, seed]
  );

  const player = useStepPlayer({ total: frames.length, speed: settings.speed });

  useKeyboardShortcuts({
    space: player.toggle,
    arrowright: player.stepForward,
    arrowleft: player.stepBack,
    r: player.reset,
    g: () => setSeed(Math.floor(Math.random() * 1e9)),
    f: () => canvasRef.current?.requestFullscreen?.(),
  });

  if (!module) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-white">Algorithm not found</h1>
        <Link to="/algorithms" className="btn-primary mt-6 inline-flex">
          Browse algorithms
        </Link>
      </div>
    );
  }

  const { meta } = module;
  const Visualizer = VISUALIZERS[module.visualizer];
  const showSize = module.visualizer === 'array';
  const isFav = favorites.includes(meta.id);
  const frame = frames[player.index];

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/algorithms" className="btn-icon" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{meta.name}</h1>
              <span className={cn('chip border', difficultyColor[meta.difficulty])}>
                {meta.difficulty}
              </span>
            </div>
            <p className="text-sm text-slate-400">{getCategoryMeta(meta.category).label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleFavorite(meta.id)} className="btn-icon" aria-label="Favorite">
            <Star className={cn('h-4 w-4', isFav && 'fill-amber-400 text-amber-400')} />
          </button>
          <button onClick={() => setShowKeys((v) => !v)} className="btn-icon" aria-label="Shortcuts">
            <Keyboard className="h-4 w-4" />
          </button>
          <button
            onClick={() => canvasRef.current?.requestFullscreen?.()}
            className="btn-icon"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button onClick={share} className="btn-ghost">
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {showKeys && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 rounded-xl border border-white/10 bg-surface-800/50 px-4 py-3 text-xs text-slate-400">
          <span><kbd className="text-slate-200">Space</kbd> play/pause</span>
          <span><kbd className="text-slate-200">←/→</kbd> step</span>
          <span><kbd className="text-slate-200">R</kbd> reset</span>
          <span><kbd className="text-slate-200">G</kbd> new data</span>
          <span><kbd className="text-slate-200">F</kbd> fullscreen</span>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[260px_1fr_340px]">
        {/* Left: controls */}
        <aside className="card order-2 p-5 lg:order-1">
          <h2 className="mb-4 text-sm font-semibold text-white">Controls</h2>
          <Controls
            isPlaying={player.isPlaying}
            isFirst={player.isFirst}
            isLast={player.isLast}
            index={player.index}
            total={frames.length}
            speed={settings.speed}
            arraySize={size}
            showSizeControl={showSize}
            onToggle={player.toggle}
            onStepBack={player.stepBack}
            onStepForward={player.stepForward}
            onReset={player.reset}
            onGenerate={() => setSeed(Math.floor(Math.random() * 1e9))}
            onSpeed={(v) => update('speed', v)}
            onSize={setSize}
            onScrub={player.goTo}
          />
        </aside>

        {/* Center: canvas */}
        <div
          ref={canvasRef}
          className="card order-1 flex min-h-[360px] flex-col bg-surface-900/60 p-4 lg:order-2 lg:min-h-[520px]"
        >
          <Suspense fallback={<Spinner className="flex-1" />}>
            {frame ? <Visualizer frame={frame} arraySize={size} seed={seed} /> : <Spinner className="flex-1" />}
          </Suspense>
        </div>

        {/* Right: educational tabs */}
        <aside className="card order-3 max-h-[520px] overflow-hidden p-5">
          <Tabs
            items={[
              { id: 'explanation', label: 'Explanation', content: <Explanation meta={meta} /> },
              { id: 'code', label: 'Source Code', content: <CodeViewer code={module.code} /> },
              { id: 'complexity', label: 'Complexity', content: <ComplexityPanel complexity={meta.complexity} /> },
              {
                id: 'pseudocode',
                label: 'Pseudocode',
                content: (
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-surface-950/70 p-4 font-mono text-sm text-slate-300">
                    {meta.pseudocode}
                  </pre>
                ),
              },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}

function Explanation({ meta }: { meta: AlgorithmMeta }) {
  return (
    <div className="space-y-5 text-sm text-slate-300">
      <p className="leading-relaxed">{meta.description}</p>

      <Section title="When to use it">
        <p className="leading-relaxed">{meta.whenToUse}</p>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="Advantages">
          <ul className="space-y-1">
            {meta.advantages.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-emerald-400">+</span> {a}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Disadvantages">
          <ul className="space-y-1">
            {meta.disadvantages.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-rose-400">−</span> {d}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Real-world applications">
        <ul className="list-disc space-y-1 pl-5">
          {meta.applications.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Section>

      <Section title="Step-by-step">
        <ol className="list-decimal space-y-1 pl-5">
          {meta.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h4>
      {children}
    </div>
  );
}

export default VisualizationPage;
