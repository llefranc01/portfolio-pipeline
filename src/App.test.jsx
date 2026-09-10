import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

const renderApp = (initialEntries = ['/']) => {
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  test('renders the resume page at the home route', () => {
    renderApp()

    expect(screen.getByText('Landen Lefrancois')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub ↗' })).toHaveAttribute(
      'href',
      'https://github.com/llefranc01',
    )
  })

  test('renders the tech stack page at the TechStack route', () => {
    renderApp(['/TechStack'])

    expect(
      screen.getByRole('heading', { name: 'How this site gets built & shipped' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'React 19' })).toBeInTheDocument()
    expect(screen.getByText(/Component library for both pages/)).toBeInTheDocument()
  })

  test('updates the tech stack details when a node is selected', () => {
    renderApp(['/TechStack'])

    fireEvent.click(screen.getByRole('button', { name: 'Docker' }))

    expect(screen.getByText(/A multi-stage Dockerfile is in the repo/)).toBeInTheDocument()
    expect(screen.queryByText(/Component library for both pages/)).not.toBeInTheDocument()
  })
})