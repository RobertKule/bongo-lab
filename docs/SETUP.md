# Setup Guide — Bongo-Lab

## Prerequisites

- **Node.js** 20 or later — [Download](https://nodejs.org/)
- **npm** 10+ (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)
- A modern browser (Chrome/Edge recommended for PWA testing)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/bongo-lab.git
cd bongo-lab

# Install dependencies
npm install
```

## Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`. Hot Module Replacement (HMR) is enabled — changes appear instantly.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project Configuration

- **Vite config**: `vite.config.js` — includes PWA plugin, Tailwind, chunk splitting
- **Tailwind**: v4 with `@tailwindcss/vite` plugin — configured in `vite.config.js`
- **ESLint**: `eslint.config.js` — React hooks and refresh plugins

## PWA Testing

1. Build the project: `npm run build`
2. Preview it: `npm run preview`
3. Open Chrome DevTools > Application > Service Workers
4. Verify the service worker is registered and active
5. Test offline: Network tab > check "Offline" > reload the page
6. On Android: Chrome menu > "Add to Home Screen"

## Troubleshooting

### `npm install` fails
- Ensure Node.js 20+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then retry

### Dev server won't start
- Check if port 5173 is already in use
- Try: `npm run dev -- --port 3000`

### Tests fail to run
- Ensure `jsdom` is installed: `npm ls jsdom`
- Check that `src/test/setup.js` exists

### PWA not working in dev mode
- Service workers only work in production builds. Use `npm run build && npm run preview`.
