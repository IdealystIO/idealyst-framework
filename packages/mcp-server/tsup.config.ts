import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tools/index': 'src/tools/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  shims: true, // Adds polyfills for import.meta.url in CJS builds
});
