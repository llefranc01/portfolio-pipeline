import React, { useState } from "react";

// cdn.simpleicons.org serves single-color brand mark SVGs — used here
// the way a "built with" badge row would be, not as reproduced artwork.
const icon = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`;

// ------------------------------------------------------------------
// Pipeline data — four stages, left to right (scrolls sideways on
// narrow screens). Mirrors .github/workflows/ci.yml job order:
// test-and-build → build-and-push-image → deploy-staging/production.
// A stage can set `dashed: true` to mark something that exists in the
// repo but isn't wired into CI yet.
// ------------------------------------------------------------------
const STAGES = [
  {
    id: "author",
    index: "00",
    title: "Author",
    subtitle: "Local development",
    nodes: [
      {
        name: "React 19",
        icon: icon("react", "61DAFB"),
        detail:
          "Component library for both pages — the resume page and this stack diagram are both React components rendered client-side.",
      },
      {
        name: "Vite",
        icon: icon("vite", "646CFF"),
        detail:
          "Dev server and build tool. Handles hot module reload locally and bundles the production build that gets copied into the Docker image.",
      },
      {
        name: "React Router",
        icon: icon("reactrouter", "CA4245"),
        detail:
          "Client-side routing between the resume page and this tech-stack page — no full page reload when switching.",
      },
      {
        name: "Bootstrap 5",
        icon: icon("bootstrap", "7952B3"),
        detail:
          "Base grid and responsive utilities used across the site shell.",
      },
      {
        name: "Vitest",
        icon: icon("vitest", "6E9F18"),
        detail:
          "Unit/component tests, run locally and again as a required check in CI before anything ships.",
      },
    ],
  },
  {
    id: "build",
    index: "01",
    title: "Build & test",
    subtitle: "test-and-build job",
    nodes: [
      {
        name: "GitHub Actions",
        icon: icon("githubactions", "2088FF"),
        detail:
          "Workflow triggers on every push to any branch and on every pull request. The test-and-build job checks out the repo, sets up Node 22, installs dependencies, lints, runs the Vitest suite, then builds with Vite. The static output is uploaded as a build artifact.",
      },
      {
        name: "Node 22 + Vitest",
        icon: icon("nodedotjs", "339933"),
        detail:
          "`npm install` → `npm run lint` (ESLint) → `npm test` (Vitest) → `npm run build`. Each step must pass before the next runs, and this whole job must succeed before an image is built.",
      },
    ],
  },
  {
    id: "image",
    index: "02",
    title: "Container image",
    subtitle: "build-and-push-image job",
    nodes: [
      {
        name: "Docker",
        icon: icon("docker", "2496ED"),
        detail:
          "Runs only on pushes to develop and master. Builds the repo's multi-stage Dockerfile (Node build stage → nginx serve stage) with Docker Buildx, using the GitHub Actions cache to speed up repeat builds.",
      },
      {
        name: "nginx",
        icon: icon("nginx", "009639"),
        detail:
          "Serves the static Vite build in the image's final stage. Its config falls back to index.html for unknown paths, so client-side routes like /stack survive a refresh or a deep link.",
      },
      {
        name: "GHCR",
        icon: icon("github", "1B2430"),
        detail:
          "The image is pushed to GitHub Container Registry as ghcr.io/llefranc01/portfolio-pipeline, authenticated with the workflow's built-in GITHUB_TOKEN (packages: write). Each push gets two tags: <branch> (moves with every build) and <branch>-<short sha> (fixed, for pinning and rollback).",
      },
    ],
  },
  {
    id: "deploy",
    index: "03",
    title: "Deploy",
    subtitle: "Branch-gated, currently simulated",
    nodes: [
      {
        name: "Staging (develop)",
        icon: null,
        detail:
          "Runs only when the push is on the develop branch, after the image is pushed. It receives the exact <branch>-<sha> image tag but currently just echoes a placeholder deploy message — no real hosting target is wired in yet.",
      },
      {
        name: "Production (master)",
        icon: null,
        gate: true,
        detail:
          "Runs only when the push is on master, after the image is pushed, and uses a `production` GitHub Environment — the hook GitHub uses for required-reviewer approval rules. Whether that protection rule is actually turned on depends on your repo's Settings → Environments config, which isn't visible from the workflow file itself. Like staging, the actual deploy step is a placeholder echo for now.",
      },
    ],
  },
];

const nodeId = (name) =>
  `node-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default function TechStack() {
  const [openNode, setOpenNode] = useState(STAGES[0].nodes[0]);

  return (
    <div className="tech-page">

      <div className="tech-wrap">
        <header className="tech-header">
          <div className="tech-eyebrow">System diagram</div>
          <h1 className="tech-title">How this site gets built &amp; shipped</h1>
          <p className="tech-subtitle">
            Every push runs through the same automated checks; pushes to
            develop and master also publish a container image, then hit a
            branch-gated deploy. Select any node for details.
          </p>
        </header>

        <div className="tech-pipeline" role="list" aria-label="Pipeline stages">
          {STAGES.map((stage, si) => (
            <React.Fragment key={stage.id}>
              <section
                role="listitem"
                aria-labelledby={`stage-${stage.id}`}
                className={`tech-stage-col${stage.dashed ? " dashed" : ""}`}
              >
                <div className="tech-stage-head">
                  <span className="tech-stage-index" aria-hidden="true">
                    {stage.index}
                  </span>
                  <div>
                    <h2 id={`stage-${stage.id}`} className="tech-stage-title">
                      {stage.title}
                    </h2>
                    <div className="tech-stage-subtitle">{stage.subtitle}</div>
                  </div>
                </div>

                <div className="tech-node-stack">
                  {stage.nodes.map((node) => {
                    const isOpen = openNode?.name === node.name;
                    return (
                      <button
                        type="button"
                        key={node.name}
                        id={nodeId(node.name)}
                        onClick={() => setOpenNode(node)}
                        aria-pressed={isOpen}
                        aria-controls="tech-detail"
                        className={`tech-node${node.gate ? " gate" : ""}${isOpen ? " active" : ""}`}
                      >
                        {/* Icons sit next to the visible tool name, so they
                            are decorative: alt="" keeps screen readers from
                            announcing the name twice. */}
                        {node.icon ? (
                          <img
                            src={node.icon}
                            alt=""
                            width={18}
                            height={18}
                            className="tech-node-icon"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className={`tech-node-dot${node.gate ? " gate" : ""}`}
                          />
                        )}
                        <span>{node.name}</span>
                        {node.gate && (
                          <>
                            {" "}
                            <span className="visually-hidden">
                              (human checkpoint)
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {si < STAGES.length - 1 && (
                <div className="tech-connector" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                    <line
                      x1="0"
                      y1="9"
                      x2="20"
                      y2="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path d="M20 3L26 9L20 15" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detail panel — announced politely when the selection changes */}
        {openNode && (
          <div
            id="tech-detail"
            className="tech-detail-panel"
            role="region"
            aria-label="Node details"
            aria-live="polite"
          >
            <div className="tech-detail-head">
              {openNode.icon && (
                <img src={openNode.icon} alt="" width={22} height={22} />
              )}
              <h3 className="tech-detail-name">{openNode.name}</h3>
              {openNode.gate && (
                <span className="tech-gate-badge">Human checkpoint</span>
              )}
            </div>
            <p className="tech-detail-text">{openNode.detail}</p>
          </div>
        )}

        <footer className="tech-footer">
          Brand marks shown are simplified single-color icons used to
          indicate tools in use, not reproductions of official brand
          artwork. Deploy steps are currently placeholders (no live
          hosting target yet), and the production approval gate depends
          on repo environment settings not visible in the workflow file.
        </footer>
      </div>
    </div>
  );
}
