import { useMemo, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import { Check, Copy } from 'lucide-react';
import type { Language } from '@/types';
import { cn } from '@/utils/cn';

const LANGUAGES: { id: Language; label: string; prism: string }[] = [
  { id: 'javascript', label: 'JavaScript', prism: 'javascript' },
  { id: 'typescript', label: 'TypeScript', prism: 'typescript' },
  { id: 'python', label: 'Python', prism: 'python' },
  { id: 'java', label: 'Java', prism: 'java' },
  { id: 'cpp', label: 'C++', prism: 'cpp' },
  { id: 'csharp', label: 'C#', prism: 'csharp' },
];

function CodeViewer({ code }: { code: Partial<Record<Language, string>> }) {
  const available = LANGUAGES.filter((l) => code[l.id]);
  const [lang, setLang] = useState<Language>(available[0]?.id ?? 'javascript');
  const [copied, setCopied] = useState(false);

  const active = LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0];
  const source = code[lang] ?? '// Implementation not available in this language yet.';

  const highlighted = useMemo(
    () => Prism.highlight(source, Prism.languages[active.prism] ?? Prism.languages.javascript, active.prism),
    [source, active.prism]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 pb-2">
        {available.map((l) => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              l.id === lang ? 'bg-brand/15 text-brand' : 'text-slate-400 hover:text-white'
            )}
          >
            {l.label}
          </button>
        ))}
        <button onClick={copy} className="btn-ghost ml-auto h-7 px-2 text-xs">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-surface-950/70 p-4">
        <code
          className={`language-${active.prism}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

export default CodeViewer;
