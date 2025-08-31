import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Only run our security tests (exclude legacy firebase-security.test.ts that pulls in storage polyfills)
  testMatch: ['**/__tests__/**/*.security.test.ts'],
  // Do not include global jest.setup.ts (it mocks rules-unit-testing)
  setupFilesAfterEnv: [],
  // Do not auto-start emulators; rules-unit-testing will run with provided rules
  setupFiles: [],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  testTimeout: 15000,
};

export default config;

