module.exports = {
  restoreMocks: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules', '/dist'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json'
    }
  },
  roots: ['src'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/tests/**/*',
    '!src/common/**/*'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1'
  }
};
