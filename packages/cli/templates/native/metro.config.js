const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = {
  projectRoot: __dirname,
  watchFolders: [
    // Add the workspace root to watch folders so Metro can watch workspace packages
    path.resolve(__dirname, '..'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      // Add the workspace root node_modules
      path.resolve(__dirname, '..', 'node_modules'),
    ],
    // Important for Idealyst to use .native extensions for React Native (eg: @idealyst/components/src/Button/Button.native.tsx)
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'native.jsx', 'native.js', 'jsx', 'js', 'json'],
  },
  watcher: {
    // When configuring custom components with .native extensions, make sure the watcher looks for them
    additionalExts: ['native.tsx', 'native.ts', 'native.jsx', 'native.js'],
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));
