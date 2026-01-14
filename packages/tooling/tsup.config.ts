import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'vite-plugin': 'src/vite-plugin.ts',
    'analyzer/index': 'src/analyzer/index.ts',
    'analyzers/index': 'src/analyzers/index.ts',
    'rules/index': 'src/rules/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2020',
  outDir: 'dist',
  splitting: false,
});
