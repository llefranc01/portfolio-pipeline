import { useState, useEffect, useRef } from "react";

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
  linkedin: "https://www.linkedin.com/in/landen-lefrancois-8120a2a4/",
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
    <div className="resume-page">

      <div className="resume-shell">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="resume-sidebar">
          <div className="resume-sidebar-inner">
            <div>
              <div className="resume-eyebrow">Software Engineer</div>
              <h1 className="resume-name">{CONTACT.name}</h1>
              <p className="resume-tagline">
                Full-stack &amp; low-code platform engineering — React,
                React Native, Mendix.
              </p>
            </div>

            <nav className="resume-nav" aria-label="Section navigation">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`resume-nav-link${active === s.id ? " active" : ""}`}
                >
                  <span className="resume-nav-index">{s.index}</span>
                  {s.label}
                </button>
              ))}
            </nav>

            <div className="resume-contact-block">
              <a className="resume-contact-line" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              <a className="resume-contact-line" href={`tel:${CONTACT.phone}`}>
                {CONTACT.phone}
              </a>
              <span className="resume-contact-line">{CONTACT.location}</span>
              <div className="resume-contact-links">
                <a
                  className="resume-contact-pill"
                  href={CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  className="resume-contact-pill"
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
        <main className="resume-main">
          {/* Summary */}
          <section
            id="summary"
            ref={(el) => (refs.current.summary = el)}
            className="resume-section"
          >
            <SectionHeader index="00" title="Summary" />
            <p className="resume-summary-text">{SUMMARY}</p>
          </section>

          {/* Skills */}
          <section
            id="skills"
            ref={(el) => (refs.current.skills = el)}
            className="resume-section"
          >
            <SectionHeader index="01" title="Technical Proficiencies" />
            <div className="resume-skill-grid">
              {SKILLS.map((group) => (
                <div key={group.label} className="resume-skill-group">
                  <div className="resume-skill-label">{group.label}</div>
                  <div className="resume-chip-row">
                    {group.items.map((item) => (
                      <span key={item} className="resume-chip">
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
            className="resume-section"
          >
            <SectionHeader index="02" title="Career Experience" />
            <div className="resume-changelog">
              {EXPERIENCE.map((job) => (
                <article key={job.company} className="resume-entry">
                  <div className="resume-entry-head">
                    <div>
                      <h3 className="resume-entry-company">{job.company}</h3>
                      <div className="resume-entry-role">
                        {job.role} · {job.location}
                      </div>
                    </div>
                    <span className="resume-version-tag">{job.range}</span>
                  </div>
                  <ul className="resume-diff-list">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="resume-diff-item">
                        <span className="resume-diff-marker">+</span>
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
            className="resume-section"
          >
            <SectionHeader index="03" title="Education" />
            <div className="resume-edu-card">
              <div>
                <div className="resume-entry-company">{EDUCATION.degree}</div>
                <div className="resume-entry-role">{EDUCATION.school}</div>
              </div>
              <span className="resume-version-tag">{EDUCATION.year}</span>
            </div>
          </section>

          {/* Projects */}
          <section
            id="projects"
            ref={(el) => (refs.current.projects = el)}
            className="resume-section resume-section-last"
          >
            <SectionHeader index="04" title="Key Projects" />
            <ul className="resume-diff-list">
              {PROJECTS.map((p, i) => (
                <li key={i} className="resume-diff-item">
                  <span className="resume-diff-marker">+</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer className="resume-footer">
            Built with React · Vite · Bootstrap · Docker — see the{" "}
            <a href="#/stack" className="resume-footer-link">
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
    <div className="resume-section-header">
      <span className="resume-section-index">{index}</span>
      <h2 className="resume-section-title">{title}</h2>
      <span className="resume-section-rule" />
    </div>
  );
}
