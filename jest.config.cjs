module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/setup.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
    '^react-tooltip$': '<rootDir>/node_modules/react-tooltip'
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/__tests__/setup.js',
    '<rootDir>/src/__tests__/suppress-warnings.js',
    '<rootDir>/src/__tests__/mocks',
    '<rootDir>/favorites-backend'
  ],
  // Suppress Node.js deprecation warnings
  setupFiles: [
    '<rootDir>/src/__tests__/suppress-warnings.js'
  ]
};