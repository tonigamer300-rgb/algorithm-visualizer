import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';
import { GITHUB_URL, SITE_NAME } from '@/config';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-900/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. MIT Licensed.
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <Link to="/algorithms" className="hover:text-white">
            Algorithms
          </Link>
          <Link to="/learn" className="hover:text-white">
            Learn
          </Link>
          <Link to="/settings" className="hover:text-white">
            Settings
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white"
          >
            <Github className="h-4 w-4" /> Source
          </a>
        </div>
        <p className="flex items-center gap-1 text-sm text-slate-500">
          Built with <Heart className="h-3.5 w-3.5 text-rose-400" /> for learners
        </p>
      </div>
    </footer>
  );
}

export default Footer;
