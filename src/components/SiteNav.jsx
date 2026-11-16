import { NavLink } from 'react-router-dom'
import { ROUTES } from '../routes'

const LINKS = [
  { to: ROUTES.resume, label: 'Resume', end: true },
  { to: ROUTES.stack, label: 'Tech Stack' },
]

export default function SiteNav() {
  return (
    <header className="site-header">
      {/* Bootstrap's visually-hidden-focusable hides the link until it
          receives keyboard focus; .skip-link only styles the shown state. */}
      <a className="skip-link visually-hidden-focusable" href="#main">
        Skip to content
      </a>
      <nav
        className="site-nav container-xl d-flex align-items-center justify-content-between gap-3"
        aria-label="Primary"
      >
        {/* Monogram rather than the full name: the Resume page's own
            <h1> already shows it right below the header. */}
        <NavLink to={ROUTES.resume} end className="site-brand">
          <span aria-hidden="true">LL</span>
          <span className="visually-hidden">Landen Lefrancois, home</span>
        </NavLink>
        <ul className="d-flex gap-1 list-unstyled m-0">
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
