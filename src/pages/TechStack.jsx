import React, { useState } from "react";

// cdn.simpleicons.org serves single-color brand mark SVGs — used here
// the way a "built with" badge row would be, not as reproduced artwork.
const icon = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`;

// ------------------------------------------------------------------
// Pipeline data — five stages, left to right / top to bottom on mobile
// ------------------------------------------------------------------
const STAGES = [
  {
    id: "author",
    index: "00",
    title: "Author",
    subtitle: "Local development",
    kind: "stage",
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
    subtitle: "GitHub Actions job",
    kind: "stage",
    nodes: [
      {
        name: "GitHub Actions",
        icon: icon("githubactions", "2088FF"),
        detail:
          "Workflow triggers on every push to any branch and on every pull request. The test-and-build job checks out the repo, sets up Node 22, installs dependencies, runs the Vitest suite, then builds with Vite. The static output is uploaded as a build artifact for the deploy jobs to reuse.",
      },
      {
        name: "Node 22 + Vitest",
        icon: icon("nodedotjs", "339933"),
        detail:
          "`npm install` → `npm test` (Vitest) → `npm run build`. Tests must pass before the build step runs, and the build must succeed before any deploy job is allowed to start.",
      },
    ],
  },
  {
    id: "deploy",
    index: "02",
    title: "Deploy",
    subtitle: "Branch-gated, currently simulated",
    kind: "gate",
    nodes: [
      {
        name: "Staging (develop)",
        icon: null,
        detail:
          "Runs only when the push is on the develop branch. Downloads the build artifact and currently just echoes a placeholder deploy message — no real hosting target is wired in yet.",
      },
      {
        name: "Production (master)",
        icon: null,
        gate: true,
        detail:
          "Runs only when the push is on master, and uses a `production` GitHub Environment — the hook GitHub uses for required-reviewer approval rules. Whether that protection rule is actually turned on depends on your repo's Settings → Environments config, which isn't visible from the workflow file itself. Like staging, the actual deploy step is a placeholder echo for now.",
      },
    ],
  },
  {
    id: "containerize",
    index: "03",
    title: "Docker (not yet wired in)",
    subtitle: "Exists in repo, unused by CI",
    kind: "stage",
    dashed: true,
    nodes: [
      {
        name: "Docker",
        icon: icon("docker", "2496ED"),
        detail:
          "A multi-stage Dockerfile is in the repo (Node build stage → nginx serve stage), but the GitHub Actions workflow doesn't build or push an image — it builds with plain Vite and ships the dist folder as a raw artifact. This is set up for containerized deployment but not yet connected to the pipeline.",
      },
      {
        name: "nginx",
        icon: icon("nginx", "009639"),
        detail:
          "Serves the static build in the Dockerfile's final stage — ready to use once/if the image gets built and deployed somewhere (a registry, a host running Docker, etc.).",
      },
    ],
  },
];

export default function TechStack() {
  const [openNode, setOpenNode] = useState(STAGES[0].nodes[0]);

  return (
    <div className="tech-page">

      <div className="tech-wrap">
        <header className="tech-header">
          <div className="tech-eyebrow">System diagram</div>
          <h1 className="tech-title">How this site gets built &amp; shipped</h1>
          <p className="tech-subtitle">
            Every push runs through the same automated checks, then a
            branch-gated deploy. Click any node for details — the dashed
            column is set up but not yet wired into CI.
          </p>
        </header>

        <div className="tech-pipeline">
          {STAGES.map((stage, si) => (
            <React.Fragment key={stage.id}>
              <div
                className={`tech-stage-col${stage.dashed ? " dashed" : ""}`}
              >
                <div className="tech-stage-head">
                  <span className="tech-stage-index">{stage.index}</span>
                  <div>
                    <div className="tech-stage-title">{stage.title}</div>
                    <div className="tech-stage-subtitle">{stage.subtitle}</div>
                  </div>
                </div>

                <div className="tech-node-stack">
                  {stage.nodes.map((node) => (
                    <button
                      key={node.name}
                      onClick={() => setOpenNode(node)}
                      className={`tech-node${node.gate ? " gate" : ""}${openNode?.name === node.name ? " active" : ""}`}
                    >
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
                          className={`tech-node-dot${node.gate ? " gate" : ""}`}
                        />
                      )}
                      <span>{node.name}</span>
                    </button>
                  ))}
                </div>
              </div>

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

        {/* Detail panel */}
        {openNode && (
          <div className="tech-detail-panel">
            <div className="tech-detail-head">
              {openNode.icon && (
                <img src={openNode.icon} alt="" width={22} height={22} />
              )}
              <span className="tech-detail-name">{openNode.name}</span>
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

// ------------------------------------------------------------------
// Styles are centralized in assets/App.css.
/*
  page: {
    minHeight: "100vh",
    background: tokens.paper,
    color: tokens.ink,
    fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "64px 24px",
    boxSizing: "border-box",
  },
  wrap: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    marginBottom: 48,
    maxWidth: 620,
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: tokens.teal,
    fontWeight: 600,
    marginBottom: 10,
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: 32,
    fontWeight: 500,
    margin: "0 0 12px 0",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: 15,
    color: tokens.inkSoft,
    lineHeight: 1.6,
    margin: 0,
  },
  pipeline: {
    display: "flex",
    alignItems: "flex-start",
    overflowX: "auto",
    paddingBottom: 8,
    marginBottom: 32,
  },
  stageCol: {
    width: 190,
    flexShrink: 0,
  },
  stageColDashed: {
    opacity: 0.72,
    border: `1px dashed ${tokens.rule}`,
    borderRadius: 10,
    padding: "12px 14px",
    marginLeft: -14,
  },
  stageHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `1px solid ${tokens.rule}`,
  },
  stageIndex: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: tokens.amber,
    fontWeight: 600,
    marginTop: 2,
  },
  stageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 16,
    fontWeight: 500,
  },
  stageSubtitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: tokens.muted,
    marginTop: 2,
  },
  nodeStack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  node: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    background: tokens.paperRaised,
    border: `1px solid ${tokens.rule}`,
    borderRadius: 7,
    padding: "9px 12px",
    fontSize: 13,
    color: tokens.ink,
    fontFamily: "'IBM Plex Sans', sans-serif",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
  nodeGate: {
    borderStyle: "dashed",
    borderColor: tokens.amber,
    background: tokens.amberSoft,
  },
  nodeActive: {
    borderColor: tokens.teal,
    boxShadow: `0 0 0 1px ${tokens.teal}`,
  },
  nodeIcon: {
    flexShrink: 0,
  },
  nodeDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  connector: {
    display: "flex",
    alignItems: "center",
    height: 32,
    marginTop: 44,
    flexShrink: 0,
  },
  detailPanel: {
    background: tokens.paperRaised,
    border: `1px solid ${tokens.rule}`,
    borderRadius: 10,
    padding: "22px 26px",
    maxWidth: 640,
  },
  detailHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  detailName: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 500,
  },
  gateBadge: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: tokens.amber,
    background: tokens.amberSoft,
    borderRadius: 20,
    padding: "3px 10px",
    marginLeft: 4,
  },
  detailText: {
    fontSize: 14.5,
    lineHeight: 1.65,
    color: tokens.inkSoft,
    margin: 0,
  },
  footer: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: tokens.muted,
    marginTop: 40,
  },
};
*/
