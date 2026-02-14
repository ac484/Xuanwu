export default {
  preset: 'frontend',
  project: {
    name: 'Ac-Xuanwu',
    description: 'A project that integrates Next.js with Firebase and Genkit.',
    maintainers: ['7s.i@pm.me'],
    website: 'https://Ac-Xuanwu.com',
  },
  analysis: {
    include: [
      'src/**/*.{js,jsx,ts,tsx}',
    ],
    exclude: [
      '**/*.d.ts',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.stories.{js,jsx,ts,tsx}',
      '**/__tests__/**',
      '**/__mocks__/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      'docs/**',
      '.idx/**',
      'public/**',
      'src/app/_components/ui/**'
    ],
    maxFileSize: 1024 * 1024,
    allowSymlinks: true,
  },
  output: {
    path: 'repomix.output.json',
    format: 'json',
  },
  conventions: {
    conventionalCommits: true,
    formatting: {
      prettier: true,
      indent: 2,
      maxLength: 80,
    },
    naming: {
      file: 'kebab-case',
      directory: 'kebab-case',
    },
  },
  ci: {
    runOnPush: true,
    branches: ['main', 'develop'],
  },
};
