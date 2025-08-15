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
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.native.ts', '**/*.native.tsx'],
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      clean: true,
    }),
  ],
  external: [
    'react',
    'react-dom',
    'react-native',
    'react-native-unistyles',
    '@react-native/normalize-colors',
    'react-native-edge-to-edge',
    'react-native-nitro-modules',
    '@react-native-vector-icons/common',
    '@react-native-vector-icons/material-design-icons',
    '@mdi/js',
    '@mdi/react',
  ],
}; 