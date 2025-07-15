const typescript = require('rollup-plugin-typescript2');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfig: './tsconfig.json',
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      clean: true,
    }),
  ],
  external: [
    'react-native-unistyles',
  ],
}; 