# Bongo-Lab

**Offline-first 2D physics simulation app for African secondary schools.**

Bongo-Lab provides interactive physics simulations designed for students and teachers in the Democratic Republic of Congo and across francophone Africa. It runs as a Progressive Web App (PWA), works offline on low-end Android devices, and uses French as its primary language.

## Features

- 5 interactive physics simulations: Pendulum, Inclined Plane, Electric Circuit, Light Reflection, Mechanical Lever
- Fully French-localized UI (DRC context)
- Offline-first PWA — works without internet after first load
- Mobile-first responsive design optimized for low-end Android devices
- African-inspired color palette and design language
- Lazy-loaded simulation modules for fast initial load
- Error boundaries for graceful failure handling

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 7 |
| 2D Canvas | Konva.js + react-konva |
| Physics Engine | Matter.js |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Routing | React Router v7 |
| PWA | vite-plugin-pwa + custom service worker |
| Testing | Vitest + React Testing Library |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/your-org/bongo-lab.git
cd bongo-lab
npm install
```

### Development

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint the codebase
```

### Production Build

```bash
npm run build        # Build to dist/
npm run preview      # Preview the production build locally
```

### PWA Testing

1. Run `npm run build && npm run preview`
2. Open the preview URL in Chrome
3. Open DevTools > Application > Service Workers to verify registration
4. Go to Network tab, check "Offline", and reload — the app should still work
5. On Android, use Chrome's "Add to Home Screen" to install as an app

## Project Structure

```
src/
  components/       # Reusable UI components
    Layout/         # Header, Navigation, Footer
  pages/            # Route-level page components
  simulations/      # Individual simulation modules
  utils/            # Translations, physics helpers, offline utils
  styles/           # Tailwind CSS entry point
  test/             # Test setup and test files
docs/               # Project documentation
public/             # PWA manifest, icons, service worker
```

## Documentation

- [Setup Guide](docs/SETUP.md) — Environment setup and troubleshooting
- [Simulation Specs](docs/SIMULATIONS.md) — Physics formulas and interaction design
- [UI Mockups](docs/UI_MOCKUPS.md) — References to UI illustrations
- [Contributing](CONTRIBUTING.md) — Git workflow, conventions, and guidelines

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branching strategy, commit conventions, and development workflow.

## License

MIT
