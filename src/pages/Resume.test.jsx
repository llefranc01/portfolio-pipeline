import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { renderAt } from '../test-utils'

const sectionNav = () => screen.getByRole('navigation', { name: 'Resume sections' })

describe('Resume page', () => {
  test('renders the name, every section, and contact links', () => {
    renderAt('/')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Landen Lefrancois' }),
    ).toBeInTheDocument()
    for (const title of [
      'Summary',
      'Technical Proficiencies',
      'Career Experience',
      'Education',
      'Key Projects',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /^GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/llefranc01',
    )
  })

  test('external links announce that they open a new tab', () => {
    renderAt('/')
    const github = screen.getByRole('link', { name: 'GitHub (opens in a new tab)' })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  test('section nav marks Summary as the current location on load', () => {
    renderAt('/')
    const nav = within(sectionNav())
    expect(nav.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-current', 'location')
    expect(nav.getByRole('button', { name: 'Experience' })).not.toHaveAttribute('aria-current')
  })

  test('clicking a section button scrolls to and focuses that section', () => {
    renderAt('/')
    const experience = document.getElementById('experience')

    fireEvent.click(within(sectionNav()).getByRole('button', { name: 'Experience' }))

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    expect(experience).toHaveFocus()
  })

  test('Contact toggle expands and collapses the contact block', () => {
    renderAt('/')
    const toggle = screen.getByRole('button', { name: 'Contact' })
    const block = document.getElementById('resume-contact')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'resume-contact')
    expect(block).not.toHaveClass('open')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveTextContent('Hide contact')
    expect(block).toHaveClass('open')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
