// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.config(storybook.configs.recommended),
  {
    ignores: ["dist", "node_modules", ".DS_Store", "coverage", "storybook-static", "jest-html-reporters-attach"],
  },
  {
    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
        ),
        ...globals.node,
      }
    },
  },
  {
    files: ["src/**/*.{ts,tsx}", "src/__tests__/**/*.{ts,tsx}"] ,
    ignores: [
      // Do not run type-aware lint on stories or declaration files
      "src/**/*.stories.*",
      "src/components/ui/stories/**/*",
      "**/*.d.ts",
    ],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    },
  },
  {
    files: ["scripts/**/*.{ts,tsx}", "e2e/**/*.{ts,tsx}", "src/**/*.stories.*", "src/components/ui/stories/**/*"],
    languageOptions: {
      parserOptions: {
        // disable type-aware linting for legacy/non-app code
        project: undefined,
      },
    },
    rules: {
      // keep basic lint only, avoid type-aware rules noise
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Relax rules for declaration files; treat them as ambient typings.
    files: ["**/*.d.ts"],
    languageOptions: {
      parserOptions: {
        project: undefined,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-var": "off",
      "@typescript-eslint/no-namespace": "off",
    },
  },
  {
    // Config files often need CommonJS interop (require)
    files: ["**/*.config.{js,ts}", "tailwind.config.ts", "postcss.config.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
  {
    files: ['src/utils/__tests__/**/*.js', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^(module|require|__dirname)$' }],
    },
  }
);
