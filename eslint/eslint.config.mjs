// @ts-check
import globals from 'globals'
import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import eslintConfigPrettier from 'eslint-config-prettier'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

// import pluginReact from 'eslint-plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  allConfig: eslintJs.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
})
const patchedConfig = fixupConfigRules([...compat.extends('next/core-web-vitals')])

const config = [
  {
    ignores: [
      '.github/**',
      '.next/**',
      '.swc/**',
      '.vscode/**',
      'coverage/**',
      'node_modules/**',
      'build/**',
      'dist/**',
      'public/**',
      '**/@types/**',
      '**/index.js',
      '**/*.d.ts',
      '**/*.js',
    ],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  eslintConfigPrettier,
  eslintJs.configs.recommended,
  ...patchedConfig,
  ...tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended, // no needed when using next/core-web-vitals
  // pluginReact.configs.flat['jsx-runtime'], // no needed when using next/core-web-vitals

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'perfectionist': perfectionist,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { format: ['camelCase'], selector: 'classMethod' },
        { format: ['PascalCase'], selector: 'interface' },
        { format: null, modifiers: ['destructured'], selector: 'variable' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-cycle': 'warn',
      'import/no-unresolved': 'error',
      'no-unused-vars': 'off',
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: {
            type: {
              next: ['next', 'next-*', 'next/*'],
              react: ['react', 'react-*', 'react/*'],
            },
            value: {
              next: ['next', 'next-*', 'next/*'],
              react: ['react', 'react-*', 'react/*'],
            },
          },
          environment: 'node',
          groups: [
            'react',
            'next',
            ['external', 'external-type'],
            'type',
            'builtin',
            ['parent-type', 'sibling-type', 'index-type'],
            ['internal-type', 'internal'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          ignoreCase: true,
          internalPattern: ['@/**'],
          matcher: 'minimatch',
          maxLineLength: undefined,
          newlinesBetween: 'always',
          order: 'asc',
          specialCharacters: 'keep',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          customGroups: {},
          groups: [],
          ignoreCase: true,
          ignorePattern: [],
          matcher: 'minimatch',
          order: 'asc',
          specialCharacters: 'keep',
          type: 'line-length',
        },
      ],
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]

export default config
