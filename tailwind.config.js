/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Slate-based dark surfaces from the design spec.
        surface: {
          950: '#0F172A',
          900: '#111827',
          800: '#1E293B',
          700: '#273449',
        },
        // The primary brand color. Stored as raw RGB channels in a CSS variable
        // (--brand-rgb) so Tailwind can apply opacity modifiers like `bg-brand/70`
        // while the Settings page swaps the accent at runtime.
        brand: {
          DEFAULT: 'rgb(var(--brand-rgb) / <alpha-value>)',
          50: '#eff6ff',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px var(--brand, #3B82F6)',
        card: '0 8px 30px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'grid-slate':
          'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
