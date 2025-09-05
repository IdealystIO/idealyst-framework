/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts', // CLI entry point, tested via integration
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 60000, // 60 seconds for CLI operations
  maxWorkers: 1, // Run tests serially to avoid file system conflicts
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/templates/',
    '/dist/',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.test.json'
    }],
  },
  modulePathIgnorePatterns: ['<rootDir>/templates/'],
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|inquirer|ora|fs-extra|ansi-styles|supports-color|strip-ansi|ansi-regex|string-width|wrap-ansi|cliui|yargs|is-fullwidth-code-point|validate-npm-package-name)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleNameMapper: {
    '^chalk$': '<rootDir>/__tests__/__mocks__/chalk.js',
    '^inquirer$': '<rootDir>/__tests__/__mocks__/inquirer.js',
    '^ora$': '<rootDir>/__tests__/__mocks__/ora.js',
  },
};
