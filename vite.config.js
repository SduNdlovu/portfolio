import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolio/',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
