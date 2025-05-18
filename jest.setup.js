// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Patch IntersectionObserver to prevent test crashes (for framer-motion)
class IntersectionObserver {
  constructor(callback, options) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
const mockIntersectionObserver = class {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

// Mock ResizeObserver
const mockResizeObserver = class {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: mockResizeObserver,
});
