module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:boundaries/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'boundaries'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    'boundaries/elements': [
      {
        type: 'feature',
        pattern: 'src/features/([^/]+)/',
        capture: ['featureName'],
      },
      {
        type: 'hooks',
        pattern: 'src/hooks/',
      },
      {
        type: 'context',
        pattern: 'src/context/',
      },
      {
        type: 'ui',
        pattern: 'src/app/_components/ui/',
      },
      {
        type: 'lib',
        pattern: 'src/lib/',
      },
    ],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: '@/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'boundaries/entry-point': ['error', {
      default: 'allow',
      rules: [
        {
          target: 'feature',
          disallow: ['**/_*', '**/_*/**'],
          message: 'Module is internal. Files and folders starting with "_" cannot be imported from outside their parent feature.',
        },
      ],
    }],
    'boundaries/dependency': ['error', {
        rules: [
            {
                from: { type: 'feature', featureName: '($1)' },
                allow: [{ type: 'feature', featureName: '($1)' }],
                message: 'A feature can only import from its own modules.'
            },
            {
                from: 'feature',
                allow: ['hooks', 'context', 'ui', 'lib'],
            },
            {
                from: ['hooks', 'context', 'ui', 'lib'],
                disallow: 'feature',
                message: 'Global modules (hooks, context, etc.) cannot import from a specific feature.',
            },
        ],
    }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "function",
        "prefix": ["use"],
        "format": ["camelCase"]
      }
    ]
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
