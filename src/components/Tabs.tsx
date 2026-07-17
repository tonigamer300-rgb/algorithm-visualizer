import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((t) => t.id === active) ?? items[0];

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 overflow-x-auto border-b border-white/10">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              'relative shrink-0 px-3 py-2 text-sm font-medium transition-colors',
              t.id === active ? 'text-white' : 'text-slate-400 hover:text-white'
            )}
          >
            {t.label}
            {t.id === active && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand"
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto pt-4">{current?.content}</div>
    </div>
  );
}

export default Tabs;
