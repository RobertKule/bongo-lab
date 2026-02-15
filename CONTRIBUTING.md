# Contributing to Bongo-Lab

Thank you for contributing to Bongo-Lab! This guide covers our Git workflow, coding conventions, and development process.

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Auto-deploys on merge. |
| `develop` | Integration branch. All features merge here first. |
| `feature/<name>` | Feature branches created from `develop`. |

### Branch naming examples

```
feature/pendulum-simulation
feature/inclined-plane-controls
fix/circuit-resistance-calc
docs/update-setup-guide
```

## Development Workflow

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/simulation-name
   ```

2. **Make changes** and commit following our conventions (see below).

3. **Push** and create a Pull Request to `develop`:
   ```bash
   git push -u origin feature/simulation-name
   ```

4. **Code review** — at least one approval required before merge.

5. **Merge to `develop`** using squash merge.

6. **Release** — when `develop` is stable, create a PR from `develop` to `main`.

7. **Auto-deployment** triggers on merge to `main`.

## Commit Message Convention

Format: `<type>: <short description>`

### Types

| Type | Use for |
|------|---------|
| `feat` | New feature or simulation |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | CSS, formatting (no logic changes) |
| `refactor` | Code restructuring (no behavior change) |
| `test` | Adding or updating tests |
| `chore` | Build config, dependencies, tooling |

### Examples

```
feat: add pendulum simulation canvas
fix: correct friction calculation in inclined plane
docs: update setup instructions
style: improve mobile responsiveness
test: add unit tests for physics helpers
chore: update Vite to v7.4
```

## Code Guidelines

- **Language**: All UI text must be in French. Use `src/utils/translations.js` for strings.
- **Components**: One component per file, default export.
- **Styling**: Use Tailwind CSS utility classes. Custom CSS only in `src/styles/index.css`.
- **Performance**: Keep bundle size small. Lazy-load simulation components. Test on low-end devices.
- **Testing**: Write tests for new components. Run `npm test` before pushing.
- **Accessibility**: Use semantic HTML and ARIA labels where appropriate.

## Setting Up Your Environment

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Questions?

Open an issue or discuss in the team chat.
