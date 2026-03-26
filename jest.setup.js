/* Phase 1: Jest setup for testing library */
import '@testing-library/jest-dom';

// Phase 2: Mock IntersectionObserver for Framer Motion tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
