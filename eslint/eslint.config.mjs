import globals from 'globals'
import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import eslintConfigPrettier from 'eslint-config-prettier'
import readableTailwind from "eslint-plugin-readable-tailwind"

import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Import pluginReact from 'eslint-plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: `${__dirname}/src`,
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
  // PluginReact.configs.flat.recommended, // no needed when using next/core-web-vitals
  // PluginReact.configs.flat['jsx-runtime'], // no needed when using next/core-web-vitals

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
      'perfectionist': perfectionist,
      'readable-tailwind': readableTailwind
    },
    rules: {
      "readable-tailwind/multiline": ['warn', {
        printWidth: 100,
        group: 'newLine',
      }],
      'react/display-name': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'classMethod', format: ['camelCase'] },
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'variable', modifiers: ['destructured'], format: null },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/no-cycle': 'warn',
      'import/no-unresolved': 'error',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          ignoreCase: true,
          specialCharacters: 'keep',
          matcher: 'minimatch',
          internalPattern: ['@/**'],
          newlinesBetween: 'always',
          environment: 'node',
          groups: [
            ['react', 'next'],
            ['external', 'external-type'],
            'type',
            'builtin',
            'queries',
            'functions',
            'middlewares',
            'libs',
            'types',
            'config',
            ['parent-type', 'sibling-type', 'index-type'],
            ['internal-type', 'internal'],
            'parent',
            'sibling',
            'index',
            'object',
            'unknown',
          ],
          customGroups: {
            type: {
              react: ['react', 'react-*'],
              next: ['next', 'next-*'],
              queries: ['@/server/queries/**'],
              functions: ['@/server/functions/**'],
              middlewares: ['@/server/middlewares/**'],
              libs: ['@/libs/**'],
              types: ['@/types/**'],
              config: ['@/config/**'],
            },
            value: {
              react: ['react', 'react-*'],
              next: ['next', 'next-*'],
              queries: ['@/server/queries/**'],
              functions: ['@/server/functions/**'],
              middlewares: ['@/server/middlewares/**'],
              libs: ['@/libs/**'],
              types: ['@/types/**'],
              config: ['@/config/**'],
            },
          },
        },
      ],
    },
  },
]

export default config
