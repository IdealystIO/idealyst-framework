const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const extraNodeModules = {
  '@idealyst/components': path.resolve(__dirname, '../../../../packages/components/src'),
  '@idealyst/navigation': path.resolve(__dirname, '../../../../packages/navigation/src'),
  '@idealyst/theme': path.resolve(__dirname, '../../../../packages/theme/src'),
  '@idealyst/datagrid': path.resolve(__dirname, '../../../../packages/datagrid/src'),
  '@idealyst/datepicker': path.resolve(__dirname, '../../../../packages/datepicker/src'),
};

const config = {
  projectRoot: __dirname,
  watchFolders: [
    // Add the workspace root to watch folders so Metro can watch workspace packages
    path.resolve(__dirname, '../..'),
    // Add the monorepo packages directory
    path.resolve(__dirname, '../../../../packages'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      // Add the workspace root node_modules
      path.resolve(__dirname, '../..', 'node_modules'),
    ],
    // Important for Idealyst to use .native extensions for React Native (eg: @idealyst/components/src/Button/Button.native.tsx)
    sourceExts: ['native.tsx', 'native.ts', 'tsx', 'ts', 'native.jsx', 'native.js', 'jsx', 'js', 'json', 'cjs'],
    extraNodeModules,
    disableHierarchicalLookup: true,
  },
  watcher: {
    // When configuring custom components with .native extensions, make sure the watcher looks for them
    additionalExts: ['native.tsx', 'native.ts', 'native.jsx', 'native.js'],
  },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));
