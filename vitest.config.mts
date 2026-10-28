import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
    pool: 'threads',
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@REPLACE_ME/resumescore-core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
    },
  },
});
