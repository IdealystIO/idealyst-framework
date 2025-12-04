const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = {
  projectRoot: __dirname,
  watchFolders: [
    // Add the workspace root to watch folders so Metro can find hoisted node_modules
    path.resolve(__dirname, '../..'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      // Add the workspace root node_modules for hoisted packages
      path.resolve(__dirname, '../..', 'node_modules'),
    ],
    // Important for Idealyst to use .native extensions for React Native (eg: @idealyst/components/src/Button/Button.native.tsx)
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'native.jsx', 'native.js', 'jsx', 'js', 'json', 'cjs'],
    extraNodeModules: {
      // Redirect react and react-native imports to the local node_modules
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      // Ensure Idealyst packages use mobile's node_modules
      '@idealyst/components': path.resolve(__dirname, 'node_modules/@idealyst/components'),
      '@idealyst/navigation': path.resolve(__dirname, 'node_modules/@idealyst/navigation'),
      '@idealyst/theme': path.resolve(__dirname, 'node_modules/@idealyst/theme'),
    },
  },
  watcher: {
    // When configuring custom components with .native extensions, make sure the watcher looks for them
    additionalExts: ['native.tsx', 'native.ts', 'native.jsx', 'native.js'],
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));
