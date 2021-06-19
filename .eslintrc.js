module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'sort-imports': [
      'error',
      {
        allowSeparatedGroups: true,
        ignoreCase: true,
        memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
      },
    ],
    'sort-keys': [
      'error',
      'asc',
      { caseSensitive: false, minKeys: 2, natural: true },
    ],
    'sort-vars': ['error', { ignoreCase: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
