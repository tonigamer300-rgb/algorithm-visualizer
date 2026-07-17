import { RotateCcw } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/utils/cn';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

function SettingsPage() {
  const { settings, update, reset } = useSettings();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <button onClick={reset} className="btn-ghost">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
      <p className="mt-1 text-slate-400">Preferences are saved locally in your browser.</p>

      <div className="mt-8 space-y-4">
        <Field label="Primary color" hint="Accent used across the interface.">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => update('primaryColor', c)}
                aria-label={`Use ${c}`}
                className={cn(
                  'h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-surface-950 transition',
                  settings.primaryColor === c ? 'ring-white' : 'ring-transparent'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </Field>

        <Field label="Animation speed" hint={`${settings.speed.toFixed(2)}× default playback speed.`}>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={settings.speed}
            onChange={(e) => update('speed', Number(e.target.value))}
            className="w-56 accent-brand"
          />
        </Field>

        <Field label="Default array size" hint={`${settings.arraySize} elements when opening a visualizer.`}>
          <input
            type="range"
            min={5}
            max={60}
            value={settings.arraySize}
            onChange={(e) => update('arraySize', Number(e.target.value))}
            className="w-56 accent-brand"
          />
        </Field>

        <Field label="Sound effects" hint="Play subtle cues on comparisons and swaps.">
          <Toggle on={settings.soundEffects} onChange={(v) => update('soundEffects', v)} />
        </Field>

        <Field label="Reduced motion" hint="Minimize animations for comfort and accessibility.">
          <Toggle on={settings.reducedMotion} onChange={(v) => update('reducedMotion', v)} />
        </Field>

        <Field label="Theme" hint="A refined dark theme, tuned for long study sessions.">
          <span className="chip">Dark</span>
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card flex items-center justify-between gap-6 p-5">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-slate-400">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        on ? 'bg-brand' : 'bg-surface-700'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
          on ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

export default SettingsPage;
