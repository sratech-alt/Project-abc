import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**'] },
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // This is a static export that navigates with ordinary links on purpose: section links are
      // `/#section` anchors and page links are full page loads (see docs/architecture.md — Navigation).
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default config;
