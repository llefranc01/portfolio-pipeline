# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site (React 19 + Vite) that also shows off its own CI/CD pipeline. It has two routes: the Resume page at `/` and the Tech Stack page at `/stack`. The Tech Stack page is an interactive diagram of `.github/workflows/ci.yml`. **When you change the workflow, update the `STAGES` data in `src/pages/TechStack.jsx` to match, and the reverse.** Tests check the stage order and which stage each node belongs to.

## Commands

```bash
npm run dev                                   # Vite dev server, http://localhost:5173
npm run lint                                  # ESLint (CI runs this before tests and fails on errors)
npm test                                      # Vitest, single run (jsdom)
npx vitest                                    # watch mode
npx vitest run src/pages/TechStack.test.jsx   # one file
npx vitest run -t "clicking a node"           # tests whose name matches
npm run build                                 # production build to dist/

docker build -t portfolio-pipeline .
docker run --rm -p 8080:80 portfolio-pipeline # nginx on http://localhost:8080
```

CI runs on Node 22.

## Architecture

- **Routing.** `src/main.jsx` wraps the app in `BrowserRouter`. Route paths are defined once in `src/routes.js` (`ROUTES`). `App.jsx`, `components/SiteNav.jsx` and the Resume footer link all import from there, so don't hard-code paths. `/TechStack` redirects to `/stack` for old links, and unknown paths redirect to `/`. `src/pages/Home.jsx` and `About.jsx` are leftover placeholders and aren't routed.
- **Deep links need the nginx fallback.** Because the app uses `BrowserRouter`, `nginx.conf` (copied into the image by the Dockerfile) uses `try_files … /index.html`. Without it, refreshing `/stack` in the container returns a 404.
- **Styling.** Almost all styles live in `src/assets/App.css`, using class prefixes `site-*` (shared header and nav), `resume-*` and `tech-*`. The pages used to set styles inline; don't bring those back. `src/index.css` is only a minimal global reset (it replaced the Vite starter CSS). Bootstrap is listed in `package.json` but isn't imported anywhere.
- **Resume page responsive layout.** Above 860px, the sidebar (name, section nav, contact) is sticky on the left. Under 860px it becomes a sticky top bar below the site header, and the contact details hide behind a `Contact` toggle (`aria-expanded`, `.open` class). An `IntersectionObserver` sets which section is active. Clicking a section button calls `scrollIntoView` and moves focus to that section (the sections have `tabIndex={-1}`).
- **Tech Stack page.** All content comes from the `STAGES` array. A node with `gate: true` gets the amber "human checkpoint" style. A stage with `dashed: true` is drawn as "exists in the repo but not wired into CI" (no stage uses this right now). Clicking a node updates the `aria-live` detail panel (`#tech-detail`). Under 720px the pipeline stacks vertically.

## Design tokens (`src/assets/App.css` `:root`)

- Paper and ink palette: `--paper #f7f5f0`, `--paper-raised #fff`, `--ink #1b2430`, `--ink-soft #4a5160`, `--muted #676c75`, `--rule #dcd7ca`.
- Teal accent: `--teal #0f7173` / `--teal-soft #e4f1f0`, used for active states, links and the focus ring (`--focus-ring`).
- Amber marks gates and index numbers. `--amber #b8842e` is for **borders and dots only**, because it's 3.0:1 on paper. Amber **text** must use `--amber-ink #8a5d12`. The background is `--amber-soft #f5ebd8`.
- Fonts (Google Fonts import at the top of App.css): Fraunces for headings and names, IBM Plex Sans for body text, IBM Plex Mono for labels, indexes, chips and nav.
- Contrast target is WCAG AA (4.5:1 for text). Check before adding new color pairs.

## Accessibility conventions

- Hide text visually but keep it for screen readers with the `.visually-hidden` class. When it follows visible text, put the separating space in a bare `{" "}` text node **outside** the span. A space inside the span is dropped when the browser computes the accessible name, giving e.g. "GitHub(opens in a new tab)".
- Icons next to a visible label use `alt=""`. Decorative glyphs (`↗`, `+`, index numbers, the connector SVG) use `aria-hidden`.
- There must be exactly one `<main>` (`#main` in `App.jsx`, the target of the skip link). Pages must not render their own `<main>`.

## Tests

- Test files sit next to the code they test (`*.test.jsx`). `src/test-utils.jsx` exports `renderAt(path)`, which renders the full `<App>` inside a `MemoryRouter`, so the shared nav is always present.
- `src/setupTests.js` stubs `IntersectionObserver` and `Element.prototype.scrollIntoView`, which jsdom doesn't provide.
- Query by role and accessible name. The name "Landen Lefrancois" appears in more than one place, so target `{ level: 1 }` when you mean the heading.

## CI/CD (`.github/workflows/ci.yml`)

`test-and-build` (lint, test, build, upload `dist/`) runs on every push and PR. Then `build-and-push-image` runs only for pushes to `develop` or `master`. It pushes `ghcr.io/llefranc01/portfolio-pipeline:<branch>` and `:<branch>-<short sha>` using `GITHUB_TOKEN`; it's the only job with `packages: write`. Then `deploy-staging` (develop) or `deploy-production` (master) runs. Both deploy jobs are placeholder `echo` steps. Work happens on `develop`, and changes reach `master` through PRs.
