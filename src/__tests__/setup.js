/**
 * Test Setup Configuration - Contains global test setup and mock implementations
 */

import { createBrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

/**
 * Configure React Router Future Flags - Enable upcoming features and suppress warnings
 */
createBrowserRouter.future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

// Suppress React Router deprecation warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn(...args);
};

// Mock console.error for expected error cases
const originalError = console.error;
console.error = (...args) => {
  // Suppress expected error messages from tests
  if (typeof args[0] === 'string' && (
    args[0].includes('Error fetching countries') ||
    args[0].includes('Failed to load favorites') ||
    args[0].includes('Warning: An update to ForwardRef inside a test was not wrapped in act')
  )) {
    return;
  }
  originalError(...args);
};

/**
 * Mock IntersectionObserver - Required for components using intersection observers
 */
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    // Simulate immediate intersection
    this.callback([
      {
        isIntersecting: true,
        target: element,
        intersectionRatio: 1,
      },
    ]);
  }

  unobserve() {}
  disconnect() {}
}

/**
 * Mock ResizeObserver - Required for components using resize observers
 */
class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Add mock implementations to global scope
global.IntersectionObserver = IntersectionObserver;
global.ResizeObserver = ResizeObserver;

// Mock react-tooltip
jest.mock('react-tooltip', () => {
  return {
    __esModule: true,
    default: ({ children, ...props }) => <div {...props}>{children}</div>,
  };
}); 