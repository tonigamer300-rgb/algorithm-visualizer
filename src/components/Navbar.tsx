import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X, Binary } from 'lucide-react';
import { GITHUB_URL, SITE_NAME } from '@/config';
import { cn } from '@/utils/cn';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/algorithms', label: 'Algorithms' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand">
            <Binary className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary ml-2"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>

        <button
          className="btn-icon md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-white/10 text-white' : 'text-slate-300'
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-primary mt-1">
                <Github className="h-4 w-4" /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
