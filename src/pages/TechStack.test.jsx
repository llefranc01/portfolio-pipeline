import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { renderAt } from '../test-utils'

const detailPanel = () => screen.getByRole('region', { name: 'Node details' })

describe('TechStack page', () => {
  test('renders the four pipeline stages in CI order', () => {
    renderAt('/stack')

    const pipeline = screen.getByRole('list', { name: 'Pipeline stages' })
    const stages = within(pipeline)
      .getAllByRole('listitem')
      .map((item) => within(item).getByRole('heading', { level: 2 }).textContent)
    expect(stages).toEqual(['Author', 'Build & test', 'Container image', 'Deploy'])
  })

  test('Docker, nginx and GHCR live in the Container image stage', () => {
    renderAt('/stack')
    const imageStage = screen.getByRole('listitem', { name: 'Container image' })

    for (const name of ['Docker', 'nginx', 'GHCR']) {
      expect(within(imageStage).getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.queryByText(/not yet wired in/i)).not.toBeInTheDocument()
  })

  test('shows React 19 in the detail panel by default', () => {
    renderAt('/stack')
    expect(screen.getByRole('button', { name: 'React 19' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(detailPanel()).getByRole('heading', { name: 'React 19' })).toBeInTheDocument()
  })

  test('clicking a node shows its details and moves the selection', () => {
    renderAt('/stack')
    const docker = screen.getByRole('button', { name: 'Docker' })

    fireEvent.click(docker)

    expect(docker).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'React 19' })).toHaveAttribute('aria-pressed', 'false')
    const panel = within(detailPanel())
    expect(panel.getByRole('heading', { name: 'Docker' })).toBeInTheDocument()
    expect(panel.getByText(/Builds the repo's multi-stage Dockerfile/)).toBeInTheDocument()
    expect(screen.queryByText(/Component library for both pages/)).not.toBeInTheDocument()
  })

  test('the production node is flagged as a human checkpoint', () => {
    renderAt('/stack')
    const prod = screen.getByRole('button', { name: /Production \(master\)/ })
    expect(prod).toHaveAccessibleName('Production (master) (human checkpoint)')

    fireEvent.click(prod)
    expect(within(detailPanel()).getByText('Human checkpoint')).toBeInTheDocument()
  })

  test('deploy steps are still described as placeholders', () => {
    renderAt('/stack')
    expect(screen.getByText(/Deploy steps are currently placeholders/)).toBeInTheDocument()
  })

  test('nodes are keyboard-reachable buttons with decorative icons', () => {
    renderAt('/stack')
    for (const button of screen.getAllByRole('button')) {
      expect(button.tagName).toBe('BUTTON')
      expect(button).toHaveAttribute('type', 'button')
      button.querySelectorAll('img').forEach((img) => expect(img).toHaveAttribute('alt', ''))
    }
  })
})
