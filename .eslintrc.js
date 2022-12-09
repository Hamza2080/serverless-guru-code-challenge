module.exports = {
  extends: ['airbnb-base'],
  plugins: ['prettier'],
  rules: {
    'comma-dangle': ['error', 'never'], // Dissallow comma dangles
    'import/prefer-default-export': 'off', // Allow named exports
    'no-console': 'off', // Allow console logs
    'no-shadow': 'off',
    'max-len': 'off', // Dev discretion on line length
    'arrow-parens': ['error', 'as-needed'], // Not required to add parenthesis where not required
    'no-restricted-syntax': ['error', 'never'], // Not required due to target environment
    'no-await-in-loop': 'off', // Developer has discretion of where/how async behaviour is handled on a case by case basis
    'import/extensions': 0, // Flexible use of file extensions
    'implicit-arrow-linebreak': 'off', // Allow linebreak between return for better readability of curried functions
    'no-underscore-dangle': 'off', // Allow underscore dangles (developer discretion)
    'no-param-reassign': ["error", { "props": false }]
  },
  overrides: [
    { // Rules for TS files
      files: ['**/*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts']
        },
        'import/resolver': {
          typescript: {}
        }
      },
      rules: {
        '@typescript-eslint/indent': ['off'], // Has known issues. Removed in favour of base eslint indent
        '@typescript-eslint/no-explicit-any': 0, // Allow use of any (developer discretion)
        '@typescript-eslint/no-non-null-assertion': 0 // Allow the use of non null assertion (NB: should only be used where checks have ben carried out that TS can't detect)
      }
    },
    { // Rules for tests
      files: ['**/*.test.ts'],
      extends: ['plugin:jest/recommended'],
      env: {
        jest: true
      },
      rules: {
        'import/no-extraneous-dependencies': 'off', // Allow dev-dependencies used testing
        '@typescript-eslint/no-var-requires': 0, // Allow requires (can be useful when spying on named exports)
        '@typescript-eslint/explicit-function-return-type': 0, // Explicit return types not required for test suites
        '@typescript-eslint/ban-ts-ignore': 0, // Allow ts-ignore for ts compilation errors in mocks
        'global-require': 0, // Allow in line requiring (can be useful for spies on named exports)
        'no-throw-literal': 0 // Allow to mock third party errors (e.g. AWS)
      }
    },
    {
      // Rules for config scripts
      files: [
        'jest.config.js',
        'jest.init.js'
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off' // Allow dev-deps for project scripts
      }
    }
  ]
};
