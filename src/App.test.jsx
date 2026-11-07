import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { renderAt } from './test-utils'

const primaryNav = () => screen.getByRole('navigation', { name: 'Primary' })

describe('App routing and shared nav', () => {
  test('highlights Resume on / and Tech Stack on /stack', () => {
    const { unmount } = renderAt('/')
    let nav = within(primaryNav())
    expect(nav.getByRole('link', { name: 'Resume' })).toHaveAttribute('aria-current', 'page')
    expect(nav.getByRole('link', { name: 'Resume' })).toHaveClass('active')
    expect(nav.getByRole('link', { name: 'Tech Stack' })).not.toHaveAttribute('aria-current')
    unmount()

    renderAt('/stack')
    nav = within(primaryNav())
    expect(nav.getByRole('link', { name: 'Tech Stack' })).toHaveAttribute('aria-current', 'page')
    expect(nav.getByRole('link', { name: 'Resume' })).not.toHaveAttribute('aria-current')
  })

  test('clicking a nav link switches page and moves the highlight', () => {
    renderAt('/')
    const nav = within(primaryNav())

    fireEvent.click(nav.getByRole('link', { name: 'Tech Stack' }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'How this site gets built & shipped' }),
    ).toBeInTheDocument()
    expect(nav.getByRole('link', { name: 'Tech Stack' })).toHaveAttribute('aria-current', 'page')
  })

  test('the Resume footer link points at the same route as the nav', () => {
    renderAt('/')
    const footerLink = screen.getByRole('link', { name: 'tech stack page' })
    const navLink = within(primaryNav()).getByRole('link', { name: 'Tech Stack' })

    expect(footerLink).toHaveAttribute('href', navLink.getAttribute('href'))

    fireEvent.click(footerLink)
    expect(navLink).toHaveAttribute('aria-current', 'page')
  })

  test('the old /TechStack URL redirects to /stack', () => {
    renderAt('/TechStack')
    expect(within(primaryNav()).getByRole('link', { name: 'Tech Stack' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  test('unknown paths fall back to the Resume page', () => {
    renderAt('/does-not-exist')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Landen Lefrancois' }),
    ).toBeInTheDocument()
  })

  test('has a skip link to the single main landmark', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getAllByRole('main')).toHaveLength(1)
  })
})
