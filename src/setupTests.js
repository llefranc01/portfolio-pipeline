import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom doesn't implement these browser APIs, but the Resume page uses
// them. Stubs keep components rendering; tests that care can spy on them.

// Resume highlights the section in view via IntersectionObserver.
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Resume's section nav scrolls to the clicked section.
Element.prototype.scrollIntoView = vi.fn();
