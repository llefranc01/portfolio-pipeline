import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders a heading', () => {
  render(<App />)
  const heading = screen.getByRole('heading')
  expect(heading).toBeInTheDocument()
})