export default {
  testEnvironment: 'node',
  testTimeout: 5000,
  modulePathIgnorePatterns: [
    'index.js',
    'migrate-mongo-config.js',
    '.eslintrc.js',
    'jest.config.js',
    'assets',
    'coverage',
    'docker',
    'node_modules',
    'logs',
  ],
  globalSetup: './test/setup-global.js',
  setupFilesAfterEnv: [],
  collectCoverageFrom: ['**/*.js'],
  coveragePathIgnorePatterns: ['node_modules', 'test'],
};
