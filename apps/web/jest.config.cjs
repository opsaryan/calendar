module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [],
  watchPathIgnorePatterns: ['node_modules'],

  // Map CSS imports to an empty module so components can be rendered in tests
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/mocks/styleMock.js',
  },
};
