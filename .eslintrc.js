
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // 關閉 console.log 的警告，但允許 console.warn 和 console.error
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // 允許未使用的變數以底線開頭
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    
    // 對 any 型別發出警告而非錯誤
    '@typescript-eslint/no-explicit-any': 'warn',

    // 強制執行一致的命名慣例
    '@typescript-eslint/naming-convention': [
      'warn',
      // Interface 名稱應為 PascalCase，且不應以 'I' 開頭
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      // Type alias 應為 PascalCase
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      // Enum 名稱應為 PascalCase
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
    ],
    
    // 架構邊界規則
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // 防止 UI 層 (app) 直接存取基礎設施層 (infra)
          {
            target: 'src/app/**/*!(*.spec|*.test).*',
            from: 'src/infra/**',
            message: 'UI 層不應直接存取 Infra 層，請透過 Feature 層的介面操作。',
          },
          // 防止 features 層之間互相直接依賴，應透過共享模組或事件來溝通
          {
            target: 'src/features/**/*!(*.spec|*.test).*',
            from: 'src/features/**/*!(*.spec|*.test).*',
            message: 'Features 之間不應直接互相引用，請考慮使用共享模組、Context 或事件。',
          },
          // 允許 feature 引用自己的子模組
          {
            target: 'src/features/(*)',
            from: 'src/features/(*)',
            allow: true
          }
        ],
      },
    ],
  },
};
