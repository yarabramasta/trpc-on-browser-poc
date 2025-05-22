import antfu from '@antfu/eslint-config'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import prettierOptions from './prettier.config.js'

export default antfu(
  {
    formatters: {
      prettierOptions,
      css: true,
      markdown: false,
    },
    stylistic: false,
    react: true,
    ignores: [
      'node_modules',
      'pnpm-lock.yaml',
      '.output',
      '.vinxi',
      '**/routeTree.gen.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          internalPattern: ['^~/.+'],
          newlinesBetween: 'always',
          groups: [
            'node',
            'react',
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          customGroups: {
            value: {
              node: ['^node:.+'],
              react: ['^react$', '^react-.+'],
            },
            type: {
              node: ['^node:.+'],
              react: ['^react$', '^react-.+'],
            },
          },
        },
      ],
      'react-refresh/only-export-components': 'off',
      'no-console': 'off',
      'antfu/no-top-level-await': 'off',
      'react/prefer-destructuring-assignment': 'off',
      'test/padding-around-all': 'error',
      'test/prefer-lowercase-title': 'off',
    },
  },
  prettierPlugin,
)
