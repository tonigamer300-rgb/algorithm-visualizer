import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Github,
  ArrowRight,
  MousePointerClick,
  Footprints,
  Gauge,
  Code2,
  Timer,
  Smartphone,
} from 'lucide-react';
import { GITHUB_URL } from '@/config';
import { ALGORITHMS, CATEGORIES } from '@/algorithms/registry';

const FEATURES = [
  { icon: MousePointerClick, title: 'Interactive Animations', text: 'Watch every comparison and swap play out in real time.' },
  { icon: Footprints, title: 'Step-by-step Execution', text: 'Move forward and back one operation at a time.' },
  { icon: Gauge, title: 'Adjustable Speed', text: 'Slow down to study details or speed through the big picture.' },
  { icon: Code2, title: 'Code Display', text: 'Read clean implementations in six languages, syntax-highlighted.' },
  { icon: Timer, title: 'Complexity Analysis', text: 'Best, average and worst-case time and space at a glance.' },
  { icon: Smartphone, title: 'Mobile Friendly', text: 'A responsive, polished experience on any screen size.' },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-slate [background-size:40px_40px] opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chip mx-auto"
          >
            Open source · {ALGORITHMS.length} algorithms · MIT licensed
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl"
          >
            Learn Algorithms{' '}
            <span className="bg-gradient-to-r from-brand-400 to-brand bg-clip-text text-transparent">
              Visually
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-400"
          >
            Interactive animations for sorting, graph traversal, pathfinding, trees, recursion,
            dynamic programming, and more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/algorithms" className="btn-primary px-6 py-3 text-base">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-ghost px-6 py-3 text-base">
              <Github className="h-4 w-4" /> View GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-center text-2xl font-bold text-white">Explore by category</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/algorithms?category=${c.id}`}
              className="card group flex items-center justify-between p-4 transition-colors hover:border-brand/40"
            >
              <div>
                <p className="font-medium text-white">{c.label}</p>
                <p className="text-xs text-slate-400">{c.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
