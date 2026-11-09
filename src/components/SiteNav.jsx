import { NavLink } from 'react-router-dom'
import { ROUTES } from '../routes'

const LINKS = [
  { to: ROUTES.resume, label: 'Resume', end: true },
  { to: ROUTES.stack, label: 'Tech Stack' },
]

export default function SiteNav() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="site-nav" aria-label="Primary">
        {/* Monogram rather than the full name: the Resume page's own
            <h1> already shows it right below the header. */}
        <NavLink to={ROUTES.resume} end className="site-brand">
          <span aria-hidden="true">LL</span>
          <span className="visually-hidden">Landen Lefrancois, home</span>
        </NavLink>
        <ul className="site-nav-links">
          {LINKS.map(({ to, label, end }) => (
            <li key={to}>
              {/* NavLink sets aria-current="page" on the active link
                  automatically; the class drives the visual state. */}
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive ? 'site-nav-link active' : 'site-nav-link'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
