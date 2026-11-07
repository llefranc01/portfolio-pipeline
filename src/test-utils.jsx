import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// Renders the whole app (shared nav + routes) at a given URL.
// MemoryRouter keeps history in memory, so each test can start on any
// route without touching the real browser location.
export function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}
