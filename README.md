# portfolio-pipeline

My personal portfolio site, and also a small working example of a CI/CD pipeline.

The site has two pages:

- **Resume** (`/`): an interactive résumé laid out like a changelog. A sticky sidebar navigates between sections; under ~860px it collapses into a top bar.
- **Tech Stack** (`/stack`): a clickable diagram of how this site gets built and shipped. Every node in the diagram matches a real step in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Stack

| Area      | Tools |
| --------- | ----- |
| UI        | React 19, React Router 6 |
| Build     | Vite 8 |
| Styling   | Plain CSS with design tokens ([`src/assets/App.css`](src/assets/App.css)); Bootstrap 5 is installed but not currently imported |
| Tests     | Vitest 4, Testing Library, jsdom |
| Lint      | ESLint 10 (React Hooks + React Refresh rules) |
| Container | Multi-stage Dockerfile: Node 22 build stage, then an nginx static server |
| CI/CD     | GitHub Actions, GitHub Container Registry (GHCR) |

## Run locally

Requires Node 22.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run lint       # ESLint
npm test           # Vitest, single run
npm run build      # production build to dist/
npm run preview    # serve dist/ locally
```

## Docker

```bash
docker build -t portfolio-pipeline .
docker run --rm -p 8080:80 portfolio-pipeline   # http://localhost:8080
```

[`nginx.conf`](nginx.conf) falls back to `index.html` for unknown paths. That way a refresh or a direct link to `/stack` loads correctly instead of returning a 404.

To pull an image that CI has already published:

```bash
docker pull ghcr.io/llefranc01/portfolio-pipeline:master
```

## Pipeline

Defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

```
push / PR (any branch)
  └─ test-and-build ─ install → lint → test → build → upload dist/
       └─ build-and-push-image   (pushes to develop or master only)
            builds the Dockerfile and pushes to ghcr.io/llefranc01/portfolio-pipeline
            tagged :<branch> and :<branch>-<short sha>
              ├─ deploy-staging      (develop, "staging" environment)
              └─ deploy-production   (master, "production" environment)
```

- Each job runs only if the previous one succeeded. A failing lint or test stops everything after it.
- The workflow defaults to read-only permissions. Only the image job gets `packages: write`, so it can push to GHCR with the built-in `GITHUB_TOKEN`.
- **The deploy jobs are placeholders.** They print which image they would deploy, but no hosting target is set up yet.

## Branching

Day-to-day work happens on `develop`, which goes to staging. Changes reach `master` (production) through pull requests.
