import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

test('renders a heading', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  const heading = screen.getByRole('heading')
  expect(heading).toBeInTheDocument()
})