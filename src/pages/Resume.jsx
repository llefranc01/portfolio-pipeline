import React, { useState, useEffect, useRef } from "react";

// ------------------------------------------------------------------
// Design tokens
// Paper/ink palette with a mono "changelog" motif — each job entry
// reads like a release note: a version-tagged range, diff-style
// bullet markers, and a monospace index rail for navigation.
// ------------------------------------------------------------------
const tokens = {
  paper: "#F7F5F0",
  paperRaised: "#FFFFFF",
  ink: "#1B2430",
  inkSoft: "#4A5160",
  muted: "#8A8F98",
  rule: "#DCD7CA",
  teal: "#0F7173",
  tealSoft: "#E4F1F0",
  amber: "#B8842E",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

// ------------------------------------------------------------------
// Content — drawn from resume
// ------------------------------------------------------------------
const CONTACT = {
  name: "Landen Lefrancois",
  title: "Software Engineer",
  email: "landen.lefrancois@gmail.com",
  phone: "(408) 596-6578",
  location: "Sunnyvale, CA 94086",
  github: "https://github.com/llefranc01",
  linkedin: "#", // TODO: add your LinkedIn URL
};

const SUMMARY =
  "Versatile software engineer with six years of experience spanning full-stack web development, cross-platform mobile applications, and low-code enterprise platforms. Skilled across the stack — from React, React Native, and TypeScript on the front end to Node.js, REST/GraphQL APIs, and PostgreSQL on the back end — with additional expertise in Mendix application development, Kubernetes-based deployment, CI/CD automation, and integrating AI into business workflows. Adept at quickly adapting to new technologies and delivering reliable, user-focused applications across web, mobile, and enterprise environments.";

const SKILLS = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "HTML/CSS"],
  },
  {
    label: "Front-end",
    items: [
      "React.js",
      "React Native",
      "Next.js",
      "Ext.js",
      "Xamarin",
      "Bootstrap",
      "Redux",
      "React Context API",
    ],
  },
  {
    label: "Back-end",
    items: [
      "REST API",
      "GraphQL",
      "PostgreSQL",
      "NoSQL (Firestore)",
      "Docker",
      "Kubernetes",
      "YAML",
    ],
  },
  {
    label: "Tools & Platforms",
    items: [
      "VS Code",
      "Windows",
      "Linux",
      "Unix",
      "Git",
      "Jira",
      "Slack",
      "Mendix",
      "CI/CD",
    ],
  },
];

const EXPERIENCE = [
  {
    company: "Brook Trout Partners LLC",
    location: "Remote",
    role: "Software Engineer",
    range: "2023–2026",
    bullets: [
      "Designed, built, and maintained Mendix applications, including domain models, microflows, security, user interfaces, and integrations using Mendix Studio Pro.",
      "Created custom Java actions and React widgets to build user interfaces and workflows.",
      "Integrated agentic AI into existing workflows and knowledge bases to enhance automation, decision-making, and user productivity.",
      "Implemented and maintained third-party integrations using REST APIs, including Helcim (payments), Google services, and Mailjet, expanding platform functionality.",
      "Leveraged the Mendix Developer Portal to provision environments, manage configuration settings, and scale containerized app instances via automated Kubernetes operators.",
      "Diagnosed and resolved Mendix application performance issues by analyzing query execution plans and optimizing indexes directly in PostgreSQL via pgAdmin, improving response times for data-heavy workflows.",
    ],
  },
  {
    company: "eGain Corporation",
    location: "Sunnyvale",
    role: "Software Engineer (React Developer / EXT Developer)",
    range: "2022–2023",
    bullets: [
      "Established remote server infrastructure on AWS and Microsoft Azure, enhancing debugging capabilities.",
      "Pinpointed and resolved approximately one hundred software issues across diverse applications using Jira.",
      "Offered guidance to cross-functional teams, contributing to the enhancement of existing application functionalities.",
      "Crafted and integrated dynamic chat messages, enriching the user experience within the chat feature.",
      "Utilized Bootstrap alongside React.js to build responsive layouts and reusable UI components, ensuring consistent styling across features.",
      "Managed global application state in React.js using Redux and React Context API, streamlining data flow and reducing prop-drilling complexity.",
    ],
  },
  {
    company: "Infinite Options",
    location: "San Jose",
    role: "Front End Software Developer",
    range: "2020–2021",
    bullets: [
      "Used the Xamarin framework to build native apps for Windows, iOS, and Android.",
      "Integrated REST APIs to enhance app responsiveness, fostering real-time data exchange and optimal performance.",
      "Built RESTful CRUD APIs using Node.js and Express.js to manage user profile data, integrating with AWS data storage for the cross-platform Xamarin application.",
    ],
  },
  {
    company: "Houseme",
    location: "Santa Cruz",
    role: "Full Stack Developer",
    range: "2019–2020",
    bullets: [
      "Utilized HTML, CSS, and JavaScript to design and develop a visually appealing, user-friendly application interface.",
      "Implemented GitHub Actions CI pipelines to automate builds and run tests on every commit across a React Native codebase targeting iOS and Android.",
      "Built location-based housing search using the Google Maps API and device GPS, displaying nearby listings as interactive map pins.",
      "Employed Google Firebase Firestore to efficiently store and manage user information with secure, reliable data storage.",
    ],
  },
];

const EDUCATION = {
  degree: "B.S. in Computer Science",
  school: "University of California, Santa Cruz",
  year: "2021",
};

const PROJECTS = [
  "Developed and implemented a robust SQL database using Microsoft SQL Server Management Studio, facilitating efficient data storage and retrieval for critical business processes.",
  "Designed mobile apps using JavaScript frameworks including React, Xamarin, and Ext.js, resulting in engaging, user-friendly applications.",
  "Independently assembled a high-performance personal computer, selecting and procuring parts to build a customized, efficient computing solution.",
  "Built and optimized data analysis algorithms in Python using Pandas and Scikit-learn, with Matplotlib visualizations to communicate findings.",
];

const SECTIONS = [
  { id: "summary", label: "Summary", index: "00" },
  { id: "skills", label: "Proficiencies", index: "01" },
  { id: "experience", label: "Experience", index: "02" },
  { id: "education", label: "Education", index: "03" },
  { id: "projects", label: "Key Projects", index: "04" },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function Resume() {
  const [active, setActive] = useState("summary");
  const refs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={styles.page}>
      <style>{fontImport}</style>
      <style>{css}</style>

      <div style={styles.shell}>
        {/* ---------------- Sidebar ---------------- */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarInner}>
            <div>
              <div style={styles.eyebrow}>Software Engineer</div>
              <h1 style={styles.name}>{CONTACT.name}</h1>
              <p style={styles.tagline}>
                Full-stack &amp; low-code platform engineering — React,
                React Native, Mendix.
              </p>
            </div>

            <nav style={styles.nav} aria-label="Section navigation">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="nav-link"
                  style={{
                    ...styles.navLink,
                    ...(active === s.id ? styles.navLinkActive : {}),
                  }}
                >
                  <span style={styles.navIndex}>{s.index}</span>
                  {s.label}
                </button>
              ))}
            </nav>

            <div style={styles.contactBlock}>
              <a style={styles.contactLine} href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              <a style={styles.contactLine} href={`tel:${CONTACT.phone}`}>
                {CONTACT.phone}
              </a>
              <span style={styles.contactLine}>{CONTACT.location}</span>
              <div style={styles.contactLinks}>
                <a
                  style={styles.contactPill}
                  href={CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  style={styles.contactPill}
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------------- Main content ---------------- */}
        <main style={styles.main}>
          {/* Summary */}
          <section
            id="summary"
            ref={(el) => (refs.current.summary = el)}
            style={styles.section}
          >
            <SectionHeader index="00" title="Summary" />
            <p style={styles.summaryText}>{SUMMARY}</p>
          </section>

          {/* Skills */}
          <section
            id="skills"
            ref={(el) => (refs.current.skills = el)}
            style={styles.section}
          >
            <SectionHeader index="01" title="Technical Proficiencies" />
            <div style={styles.skillGrid}>
              {SKILLS.map((group) => (
                <div key={group.label} style={styles.skillGroup}>
                  <div style={styles.skillLabel}>{group.label}</div>
                  <div style={styles.chipRow}>
                    {group.items.map((item) => (
                      <span key={item} style={styles.chip}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience — "changelog" entries */}
          <section
            id="experience"
            ref={(el) => (refs.current.experience = el)}
            style={styles.section}
          >
            <SectionHeader index="02" title="Career Experience" />
            <div style={styles.changelog}>
              {EXPERIENCE.map((job) => (
                <article key={job.company} style={styles.entry}>
                  <div style={styles.entryHead}>
                    <div>
                      <h3 style={styles.entryCompany}>{job.company}</h3>
                      <div style={styles.entryRole}>
                        {job.role} · {job.location}
                      </div>
                    </div>
                    <span style={styles.versionTag}>{job.range}</span>
                  </div>
                  <ul style={styles.diffList}>
                    {job.bullets.map((b, i) => (
                      <li key={i} style={styles.diffItem}>
                        <span style={styles.diffMarker}>+</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* Education */}
          <section
            id="education"
            ref={(el) => (refs.current.education = el)}
            style={styles.section}
          >
            <SectionHeader index="03" title="Education" />
            <div style={styles.eduCard}>
              <div>
                <div style={styles.entryCompany}>{EDUCATION.degree}</div>
                <div style={styles.entryRole}>{EDUCATION.school}</div>
              </div>
              <span style={styles.versionTag}>{EDUCATION.year}</span>
            </div>
          </section>

          {/* Projects */}
          <section
            id="projects"
            ref={(el) => (refs.current.projects = el)}
            style={{ ...styles.section, borderBottom: "none" }}
          >
            <SectionHeader index="04" title="Key Projects" />
            <ul style={styles.diffList}>
              {PROJECTS.map((p, i) => (
                <li key={i} style={styles.diffItem}>
                  <span style={styles.diffMarker}>+</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer style={styles.footer}>
            Built with React · Vite · Bootstrap · Docker — see the{" "}
            <a href="#/stack" style={styles.footerLink}>
              tech stack page
            </a>
            .
          </footer>
        </main>
      </div>
    </div>
  );
}

function SectionHeader({ index, title }) {
  return (
    <div style={styles.sectionHeader}>
      <span style={styles.sectionIndex}>{index}</span>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <span style={styles.sectionRule} />
    </div>
  );
}

// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
const styles = {
  page: {
    minHeight: "100vh",
    background: tokens.paper,
    color: tokens.ink,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  shell: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-start",
  },
  sidebar: {
    width: 300,
    flexShrink: 0,
    position: "sticky",
    top: 0,
    height: "100vh",
    borderRight: `1px solid ${tokens.rule}`,
    padding: "56px 32px",
    boxSizing: "border-box",
    display: "flex",
  },
  sidebarInner: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
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
  name: {
    fontFamily: "'Fraunces', serif",
    fontSize: 34,
    fontWeight: 500,
    lineHeight: 1.12,
    margin: "0 0 14px 0",
    letterSpacing: "-0.01em",
  },
  tagline: {
    fontSize: 14,
    color: tokens.inkSoft,
    lineHeight: 1.55,
    margin: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    margin: "40px 0",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: 4,
    fontSize: 14,
    color: tokens.inkSoft,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  navLinkActive: {
    background: tokens.tealSoft,
    color: tokens.teal,
    fontWeight: 600,
  },
  navIndex: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: tokens.muted,
    width: 18,
  },
  contactBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 24,
    borderTop: `1px solid ${tokens.rule}`,
  },
  contactLine: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12.5,
    color: tokens.inkSoft,
    textDecoration: "none",
  },
  contactLinks: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  contactPill: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5,
    color: tokens.teal,
    border: `1px solid ${tokens.teal}`,
    borderRadius: 20,
    padding: "5px 12px",
    textDecoration: "none",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "64px 56px 40px",
    boxSizing: "border-box",
  },
  section: {
    paddingBottom: 48,
    marginBottom: 48,
    borderBottom: `1px solid ${tokens.rule}`,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 14,
    marginBottom: 22,
  },
  sectionIndex: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: tokens.amber,
    fontWeight: 600,
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 500,
    margin: 0,
    whiteSpace: "nowrap",
  },
  sectionRule: {
    flex: 1,
    height: 1,
    background: tokens.rule,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 1.75,
    color: tokens.inkSoft,
    maxWidth: 640,
    margin: 0,
  },
  skillGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "28px 40px",
  },
  skillGroup: {},
  skillLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: tokens.muted,
    marginBottom: 10,
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12.5,
    background: tokens.paperRaised,
    border: `1px solid ${tokens.rule}`,
    borderRadius: 5,
    padding: "5px 10px",
    color: tokens.ink,
  },
  changelog: {
    display: "flex",
    flexDirection: "column",
    gap: 36,
  },
  entry: {},
  entryHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 16,
  },
  entryCompany: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 500,
    margin: "0 0 4px 0",
  },
  entryRole: {
    fontSize: 13.5,
    color: tokens.inkSoft,
  },
  versionTag: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: tokens.teal,
    background: tokens.tealSoft,
    borderRadius: 4,
    padding: "4px 9px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  diffList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  diffItem: {
    display: "flex",
    gap: 10,
    fontSize: 14.5,
    lineHeight: 1.6,
    color: tokens.inkSoft,
  },
  diffMarker: {
    fontFamily: "'IBM Plex Mono', monospace",
    color: tokens.teal,
    fontWeight: 600,
    flexShrink: 0,
  },
  eduCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: tokens.paperRaised,
    border: `1px solid ${tokens.rule}`,
    borderRadius: 8,
    padding: "20px 24px",
    maxWidth: 640,
  },
  footer: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: tokens.muted,
    marginTop: 16,
  },
  footerLink: {
    color: tokens.teal,
  },
};

const css = `
  * { box-sizing: border-box; }
  .nav-link:hover { background: ${tokens.tealSoft}; color: ${tokens.teal}; }
  @media (max-width: 860px) {
    .nav-link { }
  }
`;
