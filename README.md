# Algorithm Visualizer

> Learn algorithms visually through interactive, step-by-step animations.

A modern, open-source algorithm visualizer built with **React + TypeScript + Vite + TailwindCSS**. It teaches sorting, searching, graph traversal, trees, recursion, dynamic programming and backtracking through animations you can play, pause, rewind and step through frame by frame — with a UI inspired by tools like Linear, Vercel and Figma.

[**Live demo**](https://tonigamer300-rgb.github.io/algorithm-visualizer/) · [Report a bug](https://github.com/tonigamer300-rgb/algorithm-visualizer/issues) · [Request an algorithm](https://github.com/tonigamer300-rgb/algorithm-visualizer/issues)

---

## Screenshots

> Replace these with real captures once deployed. Suggested shots:

| Home | Algorithms | Visualization |
| ---- | ---------- | ------------- |
| `docs/screenshots/home.png` | `docs/screenshots/algorithms.png` | `docs/screenshots/visualize.png` |

---

## Features

- **Interactive animations** — every comparison and swap is animated.
- **Full playback controls** — play, pause, step forward/back, scrub, reset, and regenerate data.
- **Adjustable speed & data size** — from 0.25× to 4×, arrays from 5 to 60 elements.
- **Six-language code viewer** — JavaScript, TypeScript, Python, Java, C++ and C# with syntax highlighting.
- **Complexity panel** — best/average/worst time, space, stability, in-place and recursive flags.
- **Rich explanations** — description, when to use, pros/cons, real-world applications and step-by-step walkthrough.
- **Progress tracking & favorites** — saved locally, no account required.
- **Keyboard shortcuts, fullscreen, shareable URLs and a random-algorithm button.**
- **Customizable** — accent color, default speed and size, sound cues, and reduced-motion mode.
- **Responsive & accessible**, with a polished dark theme.

## Tech stack

React · TypeScript · Vite · TailwindCSS · Framer Motion · React Router · Prism.js · Lucide Icons.
No backend — the app is fully static and deploys to GitHub Pages.

---

## Getting started

### Prerequisites

- Node.js 18+ and npm.

### Installation

```bash
git clone https://github.com/tonigamer300-rgb/algorithm-visualizer.git
cd algorithm-visualizer
npm install
```

### Development

```bash
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

### Build

```bash
npm run build     # type-checks then builds to dist/
npm run preview   # serve the production build locally
```

### Useful scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check without emitting |

---

## Deployment (GitHub Pages)

Deployment is automated via GitHub Actions.

1. Create a repository and push this project to the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Update the placeholders:
   - `base` in `vite.config.ts` must match your repository name (e.g. `/algorithm-visualizer/`).
   - `GITHUB_URL` in `src/config.ts` and the links in this README.
4. Push to `main`. The [`deploy.yml`](.github/workflows/deploy.yml) workflow lints, type-checks, builds and publishes to Pages.

The app uses hash-based routing, so deep links and refreshes work on static hosting without extra configuration.

---

## Project architecture

```
src/
  algorithms/      # One module per algorithm, grouped by category
    _shared.ts     # Frame-recording helpers
    _placeholder.ts# Factory for documented-but-not-yet-animated algorithms
    registry.ts    # ← single source of truth: register algorithms here
    sorting/  searching/  graph/  trees/  recursion/  dp/  backtracking/
  components/      # Reusable UI (Navbar, Controls, CodeViewer, Tabs, cards…)
  context/         # SettingsContext (theme, speed, favorites, progress)
  hooks/           # useStepPlayer, useKeyboardShortcuts, useLocalStorage
  pages/           # Route-level pages (code-split)
  visualizers/     # Shared, lazy-loaded visualizers (array, graph, placeholder)
  types/           # Central TypeScript interfaces
  utils/           # PRNG, formatting and helpers
  styles/          # Tailwind entry + Prism theme
```

### How it works

Each algorithm is a self-describing **module** implementing the `AlgorithmModule` contract: metadata, code snippets, a `visualizer` kind, and a pure `generateFrames(size, seed)` function that returns a deterministic list of **frames**. A shared `useStepPlayer` hook owns only an index into that frame list, which is what makes play/pause/step/scrub trivial and fully reproducible. Visualizers are pure functions of the current frame and are **shared per data shape** (array, graph) rather than duplicated per algorithm.

---

## Adding a new algorithm

Adding an algorithm touches exactly **three things** — no page or component edits required:

1. **Create the module** under the right category, e.g. `src/algorithms/sorting/shellSort.ts`, exporting an `AlgorithmModule` (metadata + `code` + `generateFrames`).
2. **Implement the visualization** by returning frames from `generateFrames` (reuse the `array` or `graph` visualizer, or add a new kind in `src/visualizers`).
3. **Register it** in `src/algorithms/registry.ts` by importing it and adding it to the `ALGORITHMS` array.

That's it — the Algorithms grid, search, cards, visualization page and Learn tracker all update automatically. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for a full walkthrough.

---

## Contributing

Contributions are very welcome — new algorithms, animated visualizers for the documented ones, bug fixes and design polish. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) first. All contributions must pass `npm run lint`, `npm run typecheck` and `npm run build` (enforced by CI and a Husky pre-commit hook running lint-staged).

## License

[MIT](LICENSE) © Algorithm Visualizer contributors.
