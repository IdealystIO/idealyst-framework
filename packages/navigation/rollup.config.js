import typescript from 'rollup-plugin-typescript2';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Get all peer dependencies to treat as externals
const peerDependencies = Object.keys(pkg.peerDependencies || {});
const dependencies = Object.keys(pkg.dependencies || {});

// React Navigation packages should be external (not bundled)
const reactNavigationExternals = [
  '@react-navigation/native',
  '@react-navigation/native-stack',
  '@react-navigation/bottom-tabs',
  '@react-navigation/drawer',
  'react',
  'react-native',
  'react-native-screens',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-router-dom',
  'react-router'
];

export default {
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
  external: [
    ...peerDependencies,
    ...dependencies,
    ...reactNavigationExternals,
    // External check function for any react-navigation packages
    (id) => id.startsWith('@react-navigation/') || id.startsWith('react')
  ],
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: ['**/__tests__/**'],
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      clean: true,
    }),
  ],
}; 