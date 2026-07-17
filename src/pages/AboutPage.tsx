import { Link } from 'react-router-dom';
import { Github, Puzzle, Zap, Palette, Accessibility } from 'lucide-react';
import { GITHUB_URL, SITE_NAME } from '@/config';

const POINTS = [
  { icon: Puzzle, title: 'Extensible by design', text: 'Adding an algorithm means writing one module and registering it in a single file — no other code changes.' },
  { icon: Zap, title: 'Fast & static', text: 'Built with Vite, code-split and lazy-loaded. Deploys anywhere as a static site, including GitHub Pages.' },
  { icon: Palette, title: 'Modern UI', text: 'A polished dark theme with smooth Framer Motion animations, inspired by tools like Linear and Vercel.' },
  { icon: Accessibility, title: 'Accessible', text: 'Keyboard shortcuts, reduced-motion support, and careful color contrast throughout.' },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white">About {SITE_NAME}</h1>
      <p className="mt-4 leading-relaxed text-slate-300">
        {SITE_NAME} is a free, open-source project that teaches algorithms through interactive
        animation instead of static explanation. Every algorithm can be played, paused, stepped
        through, sped up, and regenerated with new data — so you can build a real mental model of
        how it works, not just memorize its Big-O.
      </p>
      <p className="mt-4 leading-relaxed text-slate-300">
        It is built with React, TypeScript, Vite, TailwindCSS and Framer Motion, following clean,
        modular architecture so the community can extend it easily.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {POINTS.map((p) => (
          <div key={p.title} className="card p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-semibold text-white">{p.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-primary">
          <Github className="h-4 w-4" /> Contribute on GitHub
        </a>
        <Link to="/algorithms" className="btn-ghost">
          Browse algorithms
        </Link>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Released under the MIT License. Contributions, bug reports and new algorithm implementations
        are always welcome.
      </p>
    </div>
  );
}

export default AboutPage;
